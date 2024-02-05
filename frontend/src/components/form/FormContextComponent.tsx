import React, { useContext, useEffect, useMemo } from 'react';
import dayjs from 'dayjs';
import { useFormikContext } from 'formik';
import { FormikProps } from 'formik/dist/types';
import { useTranslation } from 'react-i18next';
import { FormProps } from './Form';

type FormContextComponentProps<Values> = {
  formProps: FormProps<Values>;
  className: string | undefined;
};

type FormContextProps = {
  isLoading: boolean;
  formChanged: boolean;
};

const FormContext = React.createContext<FormContextProps | null>(null);

export function useFormContext() {
  return useContext(FormContext);
}

export default function FormContextComponent<Values>(
  props: FormContextComponentProps<Values>,
) {
  const { i18n } = useTranslation();

  const formProps = props.formProps;
  const formik = useFormikContext();
  const values = formik.values as Values;
  const initialValues = formik.initialValues as Values;

  useEffect(() => {
    formik.validateForm();
  }, [i18n.language]);

  const formChanged = useMemo(() => {
    const ignoreFields = formProps.fieldsToNotCompare;
    if (!formik.dirty && (!ignoreFields || ignoreFields.length === 0)) {
      return false;
    } else {
      let differences = false;
      for (let key in values) {
        if (ignoreFields && ignoreFields.includes(key)) {
          continue;
        }
        let value = values[key];
        let initValue = initialValues[key];
        if (value == null && initValue == null) {
          continue;
        }
        if (dayjs.isDayjs(value) && dayjs.isDayjs(initValue)) {
          differences = !value.isSame(initValue);
          if (differences) {
            break;
          }
        } else if (value !== initValue) {
          differences = true;
          break;
        }
      }
      return differences;
    }
  }, [formik.values]);

  return (
    <FormContext.Provider
      value={{
        isLoading: !!formProps.isLoading,
        formChanged: formChanged,
      }}
    >
      <form
        onSubmit={formik.handleSubmit}
        onReset={formik.handleReset}
        className={props.className}
      >
        {typeof formProps.children === 'function'
          ? formProps.children(formik as FormikProps<Values>)
          : formProps.children}
      </form>
      {/* <ShowToastOnValidationError
        submitCount={formik.submitCount}
        isValid={formik.isValid}
      /> */}
    </FormContext.Provider>
  );
}
