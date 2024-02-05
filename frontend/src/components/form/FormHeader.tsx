import React, { ReactNode } from 'react';

type FormHeaderProps = {
  title: ReactNode;
};

export default function FormHeader(props: FormHeaderProps) {
  return <h1 className='form-header'>{props.title}</h1>;
}
