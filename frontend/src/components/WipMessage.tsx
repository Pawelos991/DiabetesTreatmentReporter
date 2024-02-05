import React from 'react';
import { Message } from 'primereact/message';
import './WipMessage.scss';

export default function Wip() {
  return (
    <>
      <Message severity='warn' text='Planowane do realizacji' className='wip-message' />
    </>
  );
}
