import { useContext, useRef } from 'react';
import { BaseAPI, Configuration, Middleware } from '../api';
import { ApiClientContext } from '../components/providers/ApiClientProvider';

export type Newable<T> = { new (...args: any[]): T };

function isFunction(item: unknown) {
  return typeof item === 'function';
}

function autoBind(instance: unknown) {
  const proto = Object.getPrototypeOf(instance);
  let propertyNames = Object.getOwnPropertyNames(proto);
  for (let name of propertyNames) {
    let value = proto[name];
    if (isFunction(value)) {
      // @ts-ignore
      instance[name] = proto[name].bind(instance);
    }
  }
}

function createInstance<T extends BaseAPI>(
  clientClass: Newable<T>,
  middleware: Middleware,
  fetchApi: typeof fetch,
) {
  const configuration = new Configuration({
    basePath: '',
    fetchApi,
  });
  const client = new clientClass(configuration).withMiddleware(middleware);
  autoBind(client);
  return client;
}

export function useApiClient<T extends BaseAPI>(clientClass: Newable<T>): T {
  const { requestMiddleware, fetchApi } = useContext(ApiClientContext);

  const client = useRef<T>();
  if (client.current == null) {
    client.current = createInstance(clientClass, requestMiddleware, fetchApi);
  }

  return client.current;
}
