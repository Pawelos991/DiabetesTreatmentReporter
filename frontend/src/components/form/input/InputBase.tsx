import React, { ReactNode } from 'react';
import { Message } from 'primereact/message';
import { classNames } from 'primereact/utils';
import './InputBase.scss';

export type InputBaseProps = {
  label: string;
  labelHtmlFor?: string;
  required?: boolean;
  id: string;
  error: string | undefined;
  children: ReactNode;
  className?: string;
  hidden?: boolean;
  disabled?: boolean;
};

export default function InputBase(props: InputBaseProps) {
  const styleHidden: React.CSSProperties = props.hidden ? { padding: 0 } : {};

  return (
    <div
      className={classNames('input-base input-base-normal', props.className)}
      hidden={props.hidden}
      style={{ ...styleHidden }}
    >
      <label htmlFor={props.labelHtmlFor ?? props.id} hidden={props.hidden}>
        {props.label}
        {props.required && <span style={{ color: 'red' }}> *</span>}
      </label>
      {props.children}
      {props.error != null && <Message severity='error' text={props.error} />}
    </div>
  );
}
