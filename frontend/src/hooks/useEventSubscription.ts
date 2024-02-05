import { useCallback, useEffect, useRef } from 'react';

export type SubscribableEvent<T> = {
  subscribe: (ev: (e: T) => void) => string;
  unsubscribe: (eventId: string) => void;
};

export function useEventSubscription<T>(
  event: SubscribableEvent<T>,
  callback: (e: T) => void,
) {
  const callbackRef = useRef<(e: T) => void>(callback);
  callbackRef.current = callback;

  const cc = useCallback((e: T) => {
    callbackRef.current(e);
  }, []);

  useEffect(() => {
    const eventId = event.subscribe(cc);
    return () => event.unsubscribe(eventId);
  }, [event, cc]);
}

export function useSubscribableEvent<T>(): {
  event: SubscribableEvent<T>;
  invoke: (e: T) => void;
} {
  const callbacks = useRef<Record<string, (e: T) => void>>({});
  const nextId = useRef<number>(1);

  const invoke = (e: T) => {
    Object.keys(callbacks.current).forEach((eventId) => callbacks.current[eventId]?.(e));
  };

  return {
    invoke,
    event: {
      subscribe: (callback) => {
        const newKey = `${nextId.current}`;
        nextId.current += 1;
        callbacks.current[newKey] = callback;
        return newKey;
      },
      unsubscribe: (eventId) => {
        if (callbacks.current[eventId] != null) {
          delete callbacks.current[eventId];
        }
      },
    },
  };
}
