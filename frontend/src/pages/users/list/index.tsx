import React, { useMemo } from 'react';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { useNavigate } from 'react-router';
import { Authority, UserApi } from '@/api';
import PageTitle from '@/components/Title';
import { useAuthContext } from '@/components/providers/AuthProvider';
import { routes } from '@/constants/routes';
import { useApiClient } from '@/hooks/useApiClient';
import useApiRequest from '@/hooks/useApiRequest';

export default function UsersList() {
  const navigate = useNavigate();
  const userApi = useApiClient(UserApi);
  const { user } = useAuthContext();
  const { data, isLoading } = useApiRequest(() => userApi.getUsers(), []);
  const users = useMemo(() => {
    if (data !== null) {
      return data.concat();
    } else {
      return undefined;
    }
  }, [isLoading]);

  return (
    !isLoading &&
    users && (
      <Card>
        <PageTitle>Lista użytkowników</PageTitle>
        <div className='w-full text-center mt-0 mb-5'>
          <h2>Użytkownicy systemu</h2>
        </div>
        <DataTable
          value={users}
          stripedRows
          paginator
          rows={20}
          totalRecords={users.length}
          dataKey='id'
          rowHover
          sortField='username'
          sortOrder={1}
          onRowClick={(row) => {
            navigate(routes.users.form, { state: { id: row.data.id } });
          }}
          footer={() => {
            if (Authority.Administrator === user?.role.toUpperCase()) {
              return (
                <Button
                  label='Dodaj użytkownika'
                  type='button'
                  onClick={() => {
                    navigate(routes.users.form);
                  }}
                />
              );
            } else {
              return <></>;
            }
          }}
        >
          <Column field='username' header='Nazwa użytkownika' sortable />
          <Column field='name' header='Imię' sortable />
          <Column field='surname' header='Nazwisko' sortable />
          <Column field='role' header='Rola' sortable />
          <Column field='doctorName' header='Nazwa doktora' sortable />
        </DataTable>
      </Card>
    )
  );
}
