import React from 'react';
import { Button } from 'primereact/button';
import { ConfirmDialog } from 'primereact/confirmdialog';
import { BasicResponse } from '../../api';
import { getExceptionMessage } from '../../utils/getExceptionMessage';
import { useToast } from '../providers/ToastProvider';

type ConfirmationDialogProps = {
  visible: boolean;
  onHide: (arg: boolean) => void;
  draggable: boolean;
  resizable: boolean;
  action: () => void | Promise<BasicResponse | void>;
  onDecline?: () => void;
  contentMessage: string;
  onSuccessMessage?: string;
  header?: string;
  confirmLabel?: string;
  declineLabel?: string;
};

export default function ConfirmationDialog(props: ConfirmationDialogProps) {
  const showToast = useToast();

  const onConfirm = async () => {
    try {
      props.onHide(false);
      await props.action();
      if (props.onSuccessMessage != null) {
        showToast({
          severity: 'success',
          summary: props.onSuccessMessage,
        });
      }
    } catch (ex) {
      showToast({
        severity: 'error',
        summary: 'Wystąpił błąd',
        detail: await getExceptionMessage(ex),
      });
    }
  };

  return (
    <ConfirmDialog
      visible={props.visible}
      header={props.header ?? 'Potwierdź operację'}
      style={{ width: '30vw', minWidth: '420px' }}
      message={props.contentMessage}
      dismissableMask
      onHide={() => props.onHide(false)}
      footer={
        <div>
          <Button
            label={props.declineLabel ?? 'Nie'}
            icon='pi pi-times'
            className='p-button-text'
            onClick={() => {
              if (props.onDecline) {
                props.onDecline();
              }
              props.onHide(false);
            }}
            autoFocus
          />
          <Button
            label={props.confirmLabel ?? 'Tak'}
            icon='pi pi-check'
            className='p-button-danger'
            onClick={onConfirm}
          />
        </div>
      }
    />
  );
}
