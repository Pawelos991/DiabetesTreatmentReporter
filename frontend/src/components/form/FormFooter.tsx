import React from 'react';
import { useFormikContext } from 'formik';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router';
import { useFormContext } from './FormContextComponent';
import './FormFooter.scss';

type FormFooterProps = {
  readOnly?: boolean;
  hideBackButton?: boolean;
  hideResetButton?: boolean;
  submitButtonLabel?: string;
  handleReset?(): void;
};

export default function FormFooter(props: FormFooterProps) {
  const formik = useFormikContext();
  const form = useFormContext();
  const navigate = useNavigate();

  const loadingOrSubmitting = formik.isSubmitting || !!form?.isLoading;

  return (
    <div className='form-footer'>
      {props.readOnly ? (
        <Button
          label='Powrót'
          type='button'
          className='p-button-secondary p-button-text'
          onClick={() => navigate(-1)}
        />
      ) : (
        <>
          <Button
            label={props.submitButtonLabel ? props.submitButtonLabel : 'Zapisz'}
            type='submit'
            disabled={loadingOrSubmitting}
            className='w-15rem'
          />
          {!props.hideBackButton && (
            <Button
              label='Anuluj'
              type='button'
              className='p-button-secondary p-button-text'
              disabled={formik.isSubmitting}
              onClick={() => navigate(-1)}
            />
          )}
        </>
      )}
    </div>
  );
}
