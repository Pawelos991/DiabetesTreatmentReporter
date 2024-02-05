import React from 'react';
import { useField } from 'formik';
import { InputText } from 'primereact/inputtext';
import { KeyFilterType } from 'primereact/keyfilter';
import { classNames } from 'primereact/utils';
import InputBase from './InputBase';

export type TextInputProps = {
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
  placeholder?: string;
};

export default function TextInput(props: TextInputProps) {
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
      <InputText
        id={id}
        name={props.name}
        value={field.value ?? ''}
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
        keyfilter={props.keyfilter}
        type={props.type}
        placeholder={props.placeholder}
      />
    </InputBase>
  );
}
