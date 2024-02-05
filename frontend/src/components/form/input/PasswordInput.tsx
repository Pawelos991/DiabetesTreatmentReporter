import React from 'react';
import { useField } from 'formik';
import { KeyFilterType } from 'primereact/keyfilter';
import { Password } from 'primereact/password';
import { classNames } from 'primereact/utils';
import InputBase from './InputBase';

export type PasswordInputProps = {
  name: string;
  label: string;
  required?: boolean;
  maxLength?: number;
  className?: string;
  readOnly?: boolean;
  hidden?: boolean;
  disabled?: boolean;
  disabledNoStyle?: boolean;
  keyfilter?: KeyFilterType;
  type?: string;
};

export default function TextInput(props: PasswordInputProps) {
  const [field, meta] = useField(props.name);

  const id = field.name;

  const error = meta.touched ? meta.error : undefined;

  const style: React.CSSProperties = props.disabled ? { backgroundColor: '#CCCCCC' } : {};

  const readonly = props.readOnly ? (props.readOnly ? ' p-readonly' : '') : '';

  return (
    <InputBase
      id={id}
      error={error}
      label={props.label}
      required={props.required}
      className={props.className}
      hidden={props.hidden}
      disabled={props.disabled}
    >
      <Password
        id={`${id}-wrapper`}
        inputId={id}
        name={props.name}
        value={field.value}
        onChange={field.onChange}
        onBlur={field.onBlur}
        className={
          classNames({
            'p-invalid': error != null,
          }) + readonly
        }
        readOnly={props.readOnly}
        hidden={props.hidden}
        maxLength={props.maxLength}
        disabled={props.disabled || props.disabledNoStyle}
        style={style}
        type={props.type}
        feedback={false}
        toggleMask
        inputStyle={{
          width: '100%',
        }}
      />
    </InputBase>
  );
}
