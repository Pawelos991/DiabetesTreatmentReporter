import React, { useCallback } from 'react';
import { Formik, FormikValues } from 'formik';
import { FormikHelpers, FormikProps } from 'formik/dist/types';
import * as Yup from 'yup';
import { delay } from '../../utils/delay';
import { getExceptionMessage } from '../../utils/getExceptionMessage';
import FormContextComponent from './FormContextComponent';

export type SubmitHandler<Values> = (
  values: Values,
  formikHelpers: FormikHelpers<Values>,
) => void | Promise<void>;

export type FormProps<Values> = {
  initialValues: Values;
  onSubmit: SubmitHandler<Values>;
  children: ((props: FormikProps<Values>) => React.ReactNode) | React.ReactNode;
  validationSchema?: Yup.AnyObjectSchema;
  enableReinitialize?: boolean;
  isLoading?: boolean;
  fieldsToNotCompare?: string[];
  className?: string;
};

export default function Form<Values extends FormikValues>(props: FormProps<Values>) {
  const onSubmit = useCallback<SubmitHandler<Values>>(
    async (values, helpers) => {
      try {
        await Promise.all([props.onSubmit(values, helpers), delay(500)]);
      } catch (ex) {
        await getExceptionMessage(ex);
      }
    },
    [props.onSubmit],
  );

  return (
    <Formik<Values>
      initialValues={props.initialValues}
      onSubmit={onSubmit}
      validationSchema={props.validationSchema}
      enableReinitialize={props.enableReinitialize ?? true}
    >
      <FormContextComponent formProps={props} className={props.className} />
    </Formik>
  );
}
