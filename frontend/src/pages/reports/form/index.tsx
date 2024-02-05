import React, { useEffect, useState } from 'react';
import { enc, SHA256 } from 'crypto-js';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useNavigate } from 'react-router';
import { useLocation, Location as Loc } from 'react-router-dom';
import * as Yup from 'yup';
import { Authority, ReportApi, ReportBase } from '@/api';
import Form, { SubmitHandler } from '@/components/form/Form';
import TextInput from '@/components/form/input/TextInput';
import { useAuthContext } from '@/components/providers/AuthProvider';
import { useToast } from '@/components/providers/ToastProvider';
import { routes } from '@/constants/routes';
import { useApiClient } from '@/hooks/useApiClient';
import { getExceptionMessage } from '@/utils/getExceptionMessage';

type Report = {
  patientsName?: string;
  year?: number;
  month?: number;
  avgSugarLevel?: number;
  timeInTarget?: number;
  timeBelowTarget?: number;
  timeAboveTarget?: number;
  bodyWeight?: number;
};

function isPreview(location: Loc) {
  return !(location.state === null || location.state.id === null);
}

export default function ReportForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthContext();
  const showToast = useToast();
  const [initialValues, setInitialValues] = useState<Report | undefined>(undefined);
  const preview = isPreview(location);
  const reportApi = useApiClient(ReportApi);
  useEffect(() => {
    if (preview) {
      reportApi.getReport({ id: location.state.id }).then((data) => {
        setInitialValues({
          patientsName: data.patientsName,
          year: data.year,
          month: data.month,
          avgSugarLevel: data.avgSugarLevel,
          timeInTarget: data.timeInTarget,
          timeBelowTarget: data.timeBelowTarget,
          timeAboveTarget: data.timeAboveTarget,
          bodyWeight: data.bodyWeight,
        });
      });
    } else {
      setInitialValues({
        patientsName: undefined,
        year: undefined,
        month: undefined,
        avgSugarLevel: undefined,
        timeInTarget: undefined,
        timeBelowTarget: undefined,
        timeAboveTarget: undefined,
        bodyWeight: undefined,
      });
    }
  }, []);

  const getValidationSchema = () =>
    Yup.object({
      patientsName: Yup.string(),
      year: Yup.number().required(),
      month: Yup.number().required(),
      avgSugarLevel: Yup.number().required(),
      timeInTarget: Yup.number().required(),
      timeBelowTarget: Yup.number().required(),
      timeAboveTarget: Yup.number().required(),
      bodyWeight: Yup.number().required(),
    });

  const handleSubmit: SubmitHandler<Report> = async (values: Report) => {
    try {
      const reportBase: ReportBase = {
        year: Number(values.year!),
        month: Number(values.month!),
        avgSugarLevel: Number(values.avgSugarLevel!),
        timeInTarget: Number(values.timeInTarget!),
        timeBelowTarget: Number(values.timeBelowTarget!),
        timeAboveTarget: Number(values.timeAboveTarget!),
        bodyWeight: Number(values.bodyWeight!),
      };
      await reportApi
        .registerReport({
          body: {
            reportBase: reportBase,
            checksum: SHA256(JSON.stringify(reportBase) + user!.username).toString(
              enc.Hex,
            ),
          },
        })
        .then((resp) => {
          navigate(routes.reports.form, { state: { id: resp.id } });
          showToast({
            severity: 'success',
            summary: 'Udało się dodać nowy raport',
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
        {preview && <h1 className='col-12 text-center'>Podgląd raportu</h1>}
        {!preview && <h1 className='col-12 text-center'>Dodanie nowego raportu</h1>}
      </div>
      {initialValues && (
        <Form<Report>
          initialValues={initialValues}
          validationSchema={getValidationSchema()}
          onSubmit={handleSubmit}
          className='mr-3 ml-3'
        >
          <div className='grid'>
            <div className='col-12'>
              <div className='grid'>
                {preview && Authority.Patient !== user?.role.toUpperCase() && (
                  <TextInput
                    className='col-12'
                    name='patientsName'
                    label='Pacjent'
                    readOnly={true}
                  />
                )}
                <TextInput className='col-3' name='year' label='Rok' readOnly={preview} />
                <TextInput
                  className='col-3'
                  name='month'
                  label='Miesiąc'
                  readOnly={preview}
                />
                <div className='col-6' />
                <TextInput
                  className='col-3'
                  name='avgSugarLevel'
                  label='Średnie stężenie cukru (mg/dL)'
                  readOnly={preview}
                />
                <TextInput
                  className='col-2'
                  name='timeInTarget'
                  label='Czas w zakresie (%)'
                  readOnly={preview}
                />
                <TextInput
                  className='col-2'
                  name='timeBelowTarget'
                  label='Czas poniżej zakresu (%)'
                  readOnly={preview}
                />
                <TextInput
                  className='col-2'
                  name='timeAboveTarget'
                  label='Czas powyżej zakresu (%)'
                  readOnly={preview}
                />
                <TextInput
                  className='col-2'
                  name='bodyWeight'
                  label='Masa ciała (kg)'
                  readOnly={preview}
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
                  navigate(routes.reports.list);
                }}
              />
            </div>
          </div>
        </Form>
      )}
      {!initialValues && (
        <div className='grid'>
          <div className='col-12 text-center'>
            <ProgressSpinner />
          </div>
        </div>
      )}
    </Card>
  );
}
