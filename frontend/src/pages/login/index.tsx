import React, { useRef } from 'react';
import { SHA256, enc } from 'crypto-js';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Messages } from 'primereact/messages';
import { classNames } from 'primereact/utils';
import { useNavigate } from 'react-router';
import * as Yup from 'yup';
import { AuthenticationApi } from '@/api';
import PageTitle from '@/components/Title';
import PasswordInput from '@/components/form/input/PasswordInput';
import { useAuthContext } from '@/components/providers/AuthProvider';
import { routes } from '@/constants/routes';
import { useApiClient } from '@/hooks/useApiClient';
import { getExceptionMessage } from '@/utils/getExceptionMessage';
import Form, { SubmitHandler } from '../../components/form/Form';
import TextInput from '../../components/form/input/TextInput';
import styles from './index.module.scss';

type Values = {
  login?: string;
  password?: string;
  captchaSecret: string | null;
};

const initialValues: Values = {
  login: undefined,
  password: undefined,
  captchaSecret: null,
};

export default function LoginPage() {
  const messages = useRef<Messages>(null);
  const authProvider = useAuthContext();
  const navigate = useNavigate();
  const authApi = useApiClient(AuthenticationApi);

  const getValidationSchema = () =>
    Yup.object({
      login: Yup.string().required(),
      password: Yup.string().required(),
    });
  const handleSubmit: SubmitHandler<Values> = async (values) => {
    try {
      const login = await authApi.login({
      body: {
        username: values.login!,
        password: SHA256(values.password!).toString(enc.Hex),
      }
      });
      if (login.success) {
        const authResponse = await authApi.checkAuthentication();
        authProvider.setAuthenticationStateFromResponse(authResponse);
        navigate(routes.home);
      } else {
        throw new Error();
      }
    } catch (e) {
      messages.current?.replace([
        {
          severity: 'error',
          summary: await getExceptionMessage(e),
          sticky: true,
        },
      ]);
    }
  };

  return (
    <Card>
      <PageTitle>Logowanie</PageTitle>
      <div className={classNames(styles.wrapper, 'grid')}>
        <div className={classNames('col-12', styles.loginForm)}>
          <div className='col-12'>
            <h1 className='text-center ml-4'>Logowanie do systemu</h1>
          </div>
          <Form<Values>
            initialValues={initialValues}
            validationSchema={getValidationSchema()}
            onSubmit={handleSubmit}
            className='grid mr-3 ml-3'
          >
            {(formik) => (
              <>
                <div className='col-12'>
                  <Messages ref={messages} />
                </div>
                <div className='lg:col-12 col-12'>
                  <TextInput name='login' label='Login' placeholder='Login' />
                </div>
                <div className='lg:col-12 col-12'>
                  <PasswordInput name='password' label='Hasło' type='password' />
                </div>
                <div className='lg:col-12 col-12'>
                  <div className='grid mr-2 '>
                    <div className='col-12 text-center'>
                      <Button
                        label='Zaloguj'
                        type='submit'
                        className='text-center w-9'
                        disabled={formik.isSubmitting}
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
          </Form>
        </div>
      </div>
    </Card>
  );
}
