import React, { useMemo } from 'react';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { useNavigate } from 'react-router';
import { Authority, ReportApi } from '@/api';
import PageTitle from '@/components/Title';
import { useAuthContext } from '@/components/providers/AuthProvider';
import { routes } from '@/constants/routes';
import { useApiClient } from '@/hooks/useApiClient';
import useApiRequest from '@/hooks/useApiRequest';

export default function ReportsList() {
  const navigate = useNavigate();
  const reportApi = useApiClient(ReportApi);
  const { user } = useAuthContext();
  const { data, isLoading } = useApiRequest(() => reportApi.getReports(), []);
  const reports = useMemo(() => {
    if (data !== null) {
      return data.concat();
    } else {
      return undefined;
    }
  }, [isLoading]);

  return (
    !isLoading &&
    reports && (
      <Card>
        <PageTitle>Lista raportów</PageTitle>
        <div className='w-full text-center mt-0 mb-5'>
          <h2>Raporty</h2>
        </div>
        <DataTable
          value={reports}
          stripedRows
          paginator
          rows={20}
          totalRecords={reports.length}
          dataKey='id'
          rowHover
          onRowClick={(row) => {
            navigate(routes.reports.form, { state: { id: row.data.id } });
          }}
          footer={() => {
            if (Authority.Patient === user?.role.toUpperCase()) {
              return (
                <Button
                  label='Dodaj raport'
                  type='button'
                  onClick={() => {
                    navigate(routes.reports.form);
                  }}
                />
              );
            } else {
              return <></>;
            }
          }}
          sortField='id'
          sortOrder={1}
        >
          {Authority.Patient !== user?.role.toUpperCase() && (
            <Column field='patientsName' header='Pacjent' sortable />
          )}
          <Column field='year' header='Rok' sortable />
          <Column field='month' header='Miesiąc' sortable />
          <Column field='avgSugarLevel' header='Średnie stężenie cukru' sortable />
          <Column field='timeInTarget' header='Czas w zakresie' sortable />
          <Column field='timeBelowTarget' header='Czas poniżej zakresu' sortable />
          <Column field='timeAboveTarget' header='Czas powyżej zakresu' sortable />
          <Column field='bodyWeight' header='Masa ciała' sortable />
        </DataTable>
      </Card>
    )
  );
}
