import { useEffect, useState } from 'react';
import CancellationToken from '../utils/CancellationToken';
import { getExceptionMessage } from '../utils/getExceptionMessage';

export type ErrorInfo = {
  message: string;
  exception: unknown;
};

export default function useApiRequest<T>(
  action: () => Promise<T>,
  dependencies: unknown[],
  changeCallback?: (data: T | null, error: ErrorInfo | null) => void,
): {
  isLoading: boolean;
  error: ErrorInfo | null;
  data: Readonly<T> | null;
  reload: (newData?: T) => void;
} {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<ErrorInfo | null>(null);

  const reload = (newData?: T) => {
    if (newData != null) {
      setData(newData);
      return () => {};
    }

    setIsLoading(true);
    setError(null);

    const token = new CancellationToken();

    const fetch = async () => {
      try {
        const result = await action();
        if (token.continue()) {
          setData(result);
          changeCallback?.(result, null);
          setIsLoading(false);
        }
      } catch (ex) {
        const msg = await getExceptionMessage(ex);
        if (token.continue()) {
          const errorInfo = {
            message: msg,
            exception: ex,
          };
          setError(errorInfo);
          setIsLoading(false);
          changeCallback?.(null, errorInfo);
        }
      }
    };

    fetch();

    return () => token.cancel();
  };

  useEffect(() => reload(), dependencies ?? []);

  return {
    isLoading,
    data,
    error,
    reload,
  };
}
