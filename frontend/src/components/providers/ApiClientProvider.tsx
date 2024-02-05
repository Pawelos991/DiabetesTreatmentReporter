import React, { createContext, useMemo } from 'react';
import { saveAs } from 'file-saver';
import { useNavigate } from 'react-router';
import { Middleware, RequestContext, ResponseContext } from '../../api';
import { routes } from '../../constants/routes';
import {
  SubscribableEvent,
  useSubscribableEvent,
} from '../../hooks/useEventSubscription';

function getFileName(response: Response): string {
  const filename = response.headers
    .get('content-disposition')
    ?.split(';')
    .find((n) => n.includes('filename='))
    ?.replace('filename=', '')
    .trim();

  return filename ?? 'eksport';
}

function useRequestTracking() {
  const onBeforeRequestEvent = useSubscribableEvent<void>();
  const onAfterRequestEvent = useSubscribableEvent<void>();

  return {
    beforeRequest: onBeforeRequestEvent.invoke,
    afterRequest: onAfterRequestEvent.invoke,
    onBeforeRequestEvent: onBeforeRequestEvent.event,
    onAfterRequestEvent: onAfterRequestEvent.event,
  };
}

type ApiClientContextValues = {
  requestMiddleware: {};
  fetchApi: typeof fetch;
  onBeforeRequestEvent: SubscribableEvent<void>;
  onAfterRequestEvent: SubscribableEvent<void>;
};

export const ApiClientContext = createContext<ApiClientContextValues>(null!);

export default function ApiClientProvider(props: { children: React.ReactNode }) {
  const navigate = useNavigate();

  const { beforeRequest, onBeforeRequestEvent, afterRequest, onAfterRequestEvent } =
    useRequestTracking();

  const getRequestMiddleware = () => {
    const tokenExceptions = [
      '/api/v1/configuration',
      '/api/v1/authorization/refresh-token',
      '/api/v1/authorization/request-uri',
    ];

    return {
      pre: async (context: RequestContext) => {
        if (tokenExceptions.includes(context.url)) {
          return context;
        }

        if (context.init == null) {
          context.init = {};
        }
        if (context.init.headers == null) {
          context.init.headers = {};
        }
        // @ts-ignore
        //context.init.headers.Authorization = `Bearer ${tokensByRef.current.accessToken}`;
      },
      post: async (context: ResponseContext) => {
        if (context.response.status === 401 && context.url !== '/api/v1/authentication') {
          const response = await context.response.json();
          if (
            response.message != null &&
            context.url !== '/api/v1/authorization/refresh-token'
          ) {
            navigate(
              `${routes.login}?error-message=${encodeURIComponent(response.message)}`,
            );
          }
          return undefined;
        }

        const contentType = context.response.headers.get('Content-Type');
        if (contentType !== 'application/json' && context.response.status === 200) {
          saveAs(await context.response.blob(), getFileName(context.response));
          return {
            status: context.response.status,
            json: async () => ({}),
            blob: async () => new Blob(),
          } as Response;
        }
        return undefined;
      },
    };
  };

  const requestMiddleware = useMemo<Middleware>(() => getRequestMiddleware(), []);

  const fetchApi = useMemo<typeof fetch>(() => {
    return async (info, init) => {
      beforeRequest();
      try {
        return await fetch(info, init);
      } finally {
        afterRequest();
      }
    };
  }, []);

  return (
    <ApiClientContext.Provider
      value={{
        requestMiddleware,
        fetchApi: fetchApi,
        onBeforeRequestEvent,
        onAfterRequestEvent,
      }}
    >
      {props.children}
    </ApiClientContext.Provider>
  );
}
