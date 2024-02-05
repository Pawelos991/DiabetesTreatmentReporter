import react from '@vitejs/plugin-react';
import { IncomingMessage, ServerResponse } from 'http';
import path from 'path';
import { defineConfig, PluginOption } from 'vite';
import svgr from 'vite-plugin-svgr';

const httpProxy = require('http-proxy');
const fs = require('fs').promises;

// const { visualizer } = require('rollup-plugin-visualizer');

function handleProxyError(req: IncomingMessage, res: ServerResponse) {
  res.writeHead(503, { 'Content-Type': 'application/json' });
  res.write(
    JSON.stringify({
      message: 'Proxy error',
    }),
  );
  res.end();
}

function i18nHmrPlugin(): PluginOption {
  return {
    name: 'i18n-hmr',
    enforce: 'post',
    async handleHotUpdate({ file, server }) {
      if (file.endsWith('.json') && file.includes('/src/i18n/')) {
        const fileContent = await fs.readFile(file, 'utf8');
        const relativePath = file
          .replace(__dirname, '')
          .replace('/src/i18n/', '')
          .replace('.json', '');

        const parts = relativePath.split('/');
        const language = parts[0];
        parts.shift();
        const namespace = parts.join('/');

        const payload = {
          jsonContent: fileContent,
          language: language,
          namespace: namespace,
        };

        console.log(`reloading ${relativePath}`);
        server.ws.send('i18n-hmr', payload);
      }
    },
  };
}

function proxyPlugin(): PluginOption {
  const proxyPaths = ['/api', '/szafir'];

  const configureServer = (server: any) => {
    const proxy = httpProxy.createProxyServer();
    proxy.on('error', (e: Error, req: IncomingMessage, res: ServerResponse) => {
      handleProxyError(req, res);
    });

    server.middlewares.use(
      (req: IncomingMessage, res: ServerResponse, next: () => void) => {
        if (proxyPaths.some((proxyPath) => req.url?.startsWith(proxyPath))) {
          try {
            proxy.web(req, res, {
              target: 'http://localhost:8080',
            });
          } catch (e) {
            handleProxyError(req, res);
          }
        } else {
          next();
        }
      },
    );
  };

  return {
    name: 'proxyPlugin',
    configurePreviewServer: configureServer,
    configureServer: configureServer,
  };
}

function getLanguageCode(modules: string[]) {
  const languages = ['pl', 'uk', 'en'];
  for (let language of languages) {
    if (modules.every((m) => m.includes(`/src/i18n/${language}`))) {
      return language;
    }
  }
  return 'common';
}

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  build: {
    outDir: 'build',
    minify: true,
    rollupOptions: {
      // plugins: [visualizer()],
      output: {
        chunkFileNames: (config) => {
          const modules = Object.keys(config.modules);
          if (modules.length > 0 && modules.every((m) => m.includes('/src/i18n'))) {
            return `assets/i18n.${getLanguageCode(modules)}.[name].[hash].js`;
          }
          if (modules.length > 0 && modules.some((m) => m.includes('/src/pages'))) {
            return 'assets/pages.[name].[hash].js';
          }
          return 'assets/[name].[hash].js';
        },
      },
    },
  },
  plugins: [
    react(),
    proxyPlugin(),
    i18nHmrPlugin(),
    svgr({
      exportAsDefault: true,
      include: '**/*.svg',
    }),
  ],
  server: {
    port: 3000,
  },
});
