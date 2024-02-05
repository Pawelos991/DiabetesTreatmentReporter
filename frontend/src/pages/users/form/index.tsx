import React, { useEffect, useMemo, useState } from 'react';
import { enc, SHA256 } from 'crypto-js';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useNavigate } from 'react-router';
import { useLocation, Location as Loc } from 'react-router-dom';
import * as Yup from 'yup';
import { RolesApi, UserApi } from '@/api';
import Form, { SubmitHandler } from '@/components/form/Form';
import DropdownInput from '@/components/form/input/DropdownInput';
import PasswordInput from '@/components/form/input/PasswordInput';
import TextInput from '@/components/form/input/TextInput';
import { useToast } from '@/components/providers/ToastProvider';
import { routes } from '@/constants/routes';
import { useApiClient } from '@/hooks/useApiClient';
import useApiRequest from '@/hooks/useApiRequest';
import { getExceptionMessage } from '@/utils/getExceptionMessage';

type User = {
  username?: string;
  name?: string;
  surname?: string;
  role?: string;
  doctorId?: number;
  password?: string;
};

function isPreview(location: Loc) {
  return !(location.state === null || location.state.id === null);
}

export default function UserForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const showToast = useToast();
  const [initialValues, setInitialValues] = useState<User | undefined>(undefined);
  const preview = isPreview(location);
  const roleApi = useApiClient(RolesApi);
  const userApi = useApiClient(UserApi);
  useEffect(() => {
    if (preview) {
      userApi.getUser({ id: location.state.id }).then((data) => {
        setInitialValues({
          username: data?.username,
          name: data.name,
          surname: data.surname,
          role: data.role.charAt(0),
          doctorId: data.doctorId,
          password: undefined,
        });
      });
    } else {
      setInitialValues({
        username: undefined,
        name: undefined,
        surname: undefined,
        role: undefined,
        doctorId: undefined,
        password: undefined,
      });
    }
  }, []);

  const { data: roles } = useApiRequest(() => roleApi.getRoles(), []);
  const { data: doctors } = useApiRequest(() => userApi.getDoctors(), []);

  const roleOptions = useMemo(() => {
    if (roles !== null) {
      return roles.map((role) => {
        return {
          label: role.name,
          value: role.code,
        };
      });
    } else {
      return undefined;
    }
  }, [roles]);

  const doctorOptions = useMemo(() => {
    if (doctors !== null) {
      return doctors.map((doctor) => {
        return {
          label: doctor.name + ' ' + doctor.surname,
          value: doctor.id,
        };
      });
    } else {
      return undefined;
    }
  }, [doctors]);

  const getValidationSchema = () =>
    Yup.object({
      username: Yup.string().required(),
      password: Yup.string().required(),
      name: Yup.string().required(),
      surname: Yup.string().required(),
      doctorId: Yup.number().optional(),
      role: Yup.string().required(),
    });

  const handleSubmit: SubmitHandler<User> = async (values: User) => {
    try {
      await userApi
        .registerUser({
          body: {
            username: values.username!,
            name: values.name!,
            surname: values.surname!,
            doctorId: values.doctorId,
            password: SHA256(values.password!).toString(enc.Hex),
            roleCode: values.role!.charAt(0),
          },
        })
        .then((resp) => {
          navigate(routes.users.form, { state: { id: resp.id } });
          showToast({
            severity: 'success',
            summary: 'Udało się dodać użytkownika',
          });
        });
    } catch (ex) {
      showToast({
        severity: 'error',
        summary: 'Wystąpił błąd',
        detail: await getExceptionMessage(ex),
      });
    }
  };

  return (
    <Card>
      <div className='grid'>
        {preview && <h1 className='col-12 text-center'>Podgląd danych użytkownika</h1>}
        {!preview && <h1 className='col-12 text-center'>Dodanie nowego użytkownika</h1>}
      </div>
      {initialValues && doctorOptions && roleOptions && (
        <Form<User>
          initialValues={initialValues}
          validationSchema={getValidationSchema()}
          onSubmit={handleSubmit}
          className='mr-3 ml-3'
        >
          <div className='grid'>
            <div className='col-12'>
              <div className='grid'>
                <TextInput
                  className='col-4'
                  name='username'
                  label='Nazwa użytkownika'
                  readOnly={preview}
                />
                {preview && <div className='col-4' />}
                {!preview && (
                  <PasswordInput className='col-4' name='password' label='Hasło' />
                )}
                <div className='col-4' />
                <TextInput
                  className='col-4'
                  name='name'
                  label='Imię'
                  readOnly={preview}
                />
                <TextInput
                  className='col-4'
                  name='surname'
                  label='Nazwisko'
                  readOnly={preview}
                />
                <div className='col-4' />
              </div>
            </div>
            <div className='col-12'>
              <div className='grid'>
                <DropdownInput
                  className='col-4'
                  name='role'
                  label='Rola'
                  options={roleOptions}
                  disabledNoStyle={preview}
                />
                <DropdownInput
                  className='col-4'
                  name='doctorId'
                  label='Lekarz'
                  options={doctorOptions}
                  disabledNoStyle={preview}
                />
              </div>
            </div>
          </div>
          <div className='grid'>
            <div className='col-12 text-center'>
              {!preview && <Button label='Zapisz' type='submit' className='mr-2' />}
              <Button
                label='Powrót'
                type='button'
                onClick={() => {
                  navigate(routes.users.list);
                }}
              />
            </div>
          </div>
        </Form>
      )}
      {!(initialValues && doctorOptions && roleOptions) && (
        <div className='grid'>
          <div className='col-12 text-center'>
            <ProgressSpinner />
          </div>
        </div>
      )}
    </Card>
  );
}
