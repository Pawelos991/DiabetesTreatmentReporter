import React, { useCallback, useContext, useRef } from 'react';
import { ReactNode } from 'react';
import { Toast, ToastMessage } from 'primereact/toast';
import './ToastProvider.scss';

const ToastContext = React.createContext<(options: ToastMessage) => void>(() => {});

export default function ToastProvider(props: { children: ReactNode }) {
  const toastRef = useRef<Toast>(null);

  const showToast = useCallback((options: ToastMessage) => {
    const optionsWithDefaults: ToastMessage = {
      life: 5000,
      severity: 'info',
      closable: true,
      ...options,
    };
    toastRef.current?.show(optionsWithDefaults);
  }, []);

  return (
    <ToastContext.Provider value={showToast}>
      <Toast
        ref={toastRef}
        className='toast no-print'
        style={{ whiteSpace: 'pre-wrap' }}
      />
      {props.children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
