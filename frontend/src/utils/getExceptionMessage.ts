import i18next from 'i18next';
import { ErrorResponse } from '@/api';

const UNRECOGNIZED_ERROR_MESSAGE = 'Wystąpił nierozpoznany błąd';
const NETWORK_ERROR_MESSAGE = 'Wystąpił błąd połączenia z serwerem';
const VALIDATION_ERROR_MESSAGE = 'Wprowadzone dane nie są prawidłowe';

function getTranslation(key: string, defaultValue: string) {
  return i18next.t<string>(key, { defaultValue });
}

async function getExceptionMessage(ex: unknown): Promise<string> {
  try {
    if (!(ex instanceof Response)) {
      if (ex instanceof Object) {
        let resp = ex as ErrorResponse;
        if (resp.message) {
          return resp.message;
        }
      }
      // eslint-disable-next-line no-console
      console.error(ex);
      return getTranslation('errors.unrecognized', UNRECOGNIZED_ERROR_MESSAGE);
    }

    if (ex && ex.status === 0) {
      return getTranslation('errors.network', NETWORK_ERROR_MESSAGE);
    }

    if (ex && ex.json) {
      const { message, code, fieldErrors } = await ex.json();

      if (fieldErrors) {
        return getTranslation('errors.validation', VALIDATION_ERROR_MESSAGE);
      }

      if (code) {
        return getTranslation(`errors.${code}`, message);
      }

      if (message && `${message}`.toLowerCase() !== 'no message available') {
        return message;
      }
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
  }

  return UNRECOGNIZED_ERROR_MESSAGE;
}

// eslint-disable-next-line import/prefer-default-export
export { getExceptionMessage };
