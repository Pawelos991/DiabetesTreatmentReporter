import React, { Fragment, Suspense, useEffect, useMemo, useReducer } from 'react';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.min.css';
import { ScrollTop } from 'primereact/scrolltop';
import { Route, Routes, useNavigate } from 'react-router';
import { BrowserRouter, useLocation } from 'react-router-dom';
import '@/themes/default.scss';
import PageLoadingScreen from '@/components/PageLoadingScreen';
import UnauthorizedLayout from '@/components/UnauthorizedLayout';
import ApiClientProvider from '@/components/providers/ApiClientProvider';
import AuthProvider, { useAuthContext } from '@/components/providers/AuthProvider';
import ToastProvider from '@/components/providers/ToastProvider';
import { routes } from '@/constants/routes';
import './App.scss';
import Layout from './components/Layout';
import NotFound from './components/NotFound';
import ScrollOnNavigation from './components/ScrollOnNavigation';

const routeFiles: Record<string, any> = import.meta.glob('/src/pages/**/*.tsx');

const unauthorizedPaths = [routes.login.index];

function useRoutes() {
  return useMemo(() => {
    return Object.keys(routeFiles).map((route) => {
      const path = route
        .replace(/\/src\/pages|index|\.tsx$/g, '')
        .replace(/\[\.{3}.+\]/, '*')
        .replace(/\[(.+)\]/, ':$1');

      return { path, component: React.lazy(routeFiles[route]) };
    });
  }, []);
}

function Providers(props: { children: React.ReactNode }) {
  return (
    <BrowserRouter>
      <ToastProvider>
        <ApiClientProvider>
          <AuthProvider>{props.children}</AuthProvider>
        </ApiClientProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

function usePageBlocking() {
  const { isAuthenticated } = useAuthContext();
  const location = useLocation();

  if (unauthorizedPaths.includes(location.pathname) && isAuthenticated) {
    return routes.home;
  }

  if (![...unauthorizedPaths].includes(location.pathname) && !isAuthenticated) {
    if (location.pathname !== '/' && location.pathname !== '') {
      return `${routes.login.index}?origin=${encodeURIComponent(location.pathname)}`;
    }
    return routes.login.index;
  }

  return null;
}

function useLayout() {
  const { isAuthenticated } = useAuthContext();
  return isAuthenticated ? Layout : UnauthorizedLayout;
}

function AppRoutes() {
  const redirection = usePageBlocking();
  const appRoutes = useRoutes();
  const LayoutComponent = useLayout();
  const navigate = useNavigate();

  useEffect(() => {
    if (redirection != null) {
      return navigate(redirection, { replace: true });
    }
  }, [redirection]);

  if (redirection != null) {
    return <></>;
  }

  return (
    <LayoutComponent>
      <Routes>
        {appRoutes.map(({ path, component: RouteComponent = Fragment }) => (
          <Route
            key={path}
            path={path}
            element={
              <Suspense fallback={<PageLoadingScreen />}>
                <RouteComponent />
              </Suspense>
            }
          />
        ))}
        <Route path='*' element={<NotFound />} />
      </Routes>
      <ScrollTop threshold={200} />
      <ScrollOnNavigation />
    </LayoutComponent>
  );
}

function useForcedUpdates() {
  const [, update] = useReducer((state) => state + 1, 0);
  useEffect(() => {
    if (import.meta.hot) {
      // @ts-ignore
      window.forceUpdate = update;
    }
  }, []);
}

function App() {
  useForcedUpdates();

  return (
    <Providers>
      <AppRoutes />
    </Providers>
  );
}

export default App;
