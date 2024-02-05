import React from 'react';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router';
import { AuthenticationApi } from '@/api';
import ConfirmationDialog from '@/components/dialog/ConfirmationDialog';
import { useAuthContext } from '@/components/providers/AuthProvider';
import { routes } from '@/constants/routes';
import { useApiClient } from '@/hooks/useApiClient';
import { useDialog } from '@/hooks/useDialog';
import './TopBar.scss';

type LogoutDialogProps = {
  logoutDialog: any;
};

function LogoutDialog(props: LogoutDialogProps) {
  const navigate = useNavigate();
  const { setAuthenticationState } = useAuthContext();
  const authApi = useApiClient(AuthenticationApi);
  const { logoutDialog } = props;

  const onLogout = async () => {
    try {
      await authApi.logout();
      setAuthenticationState({ isAuthenticated: false, user: undefined });
      navigate(routes.login.index);
    } catch (e) {}
  };

  return (
    <ConfirmationDialog
      {...logoutDialog.dialogProps}
      action={async () => onLogout()}
      contentMessage='Czy na pewno chcesz się wylogować?'
    />
  );
}

type Props = {
  variant: 'authorized' | 'unauthorized';
  visibleDesktop: boolean;
  onSideBarSwitch: () => void;
};

export default function TopBar(props: Props) {

  const logoutDialog = useDialog<void, void>();

  const actions =
    props.variant === 'authorized'
      ? [
          {
            icon: 'pi pi-sign-out',
            label: 'Wyloguj się',
            onClick: () => logoutDialog.show(),
          },
        ]
      : [];

  const switchIcon = 'pi pi-bars';

  const desktopButtonLabel = props.visibleDesktop
    ? 'Ukryj menu boczne'
    : 'Pokaż menu boczne';

  return (
    <>
      <header className='layout-top-bar'>
        {props.variant === 'authorized' && (
          <Button
            icon={switchIcon}
            className='p-button-rounded p-button-secondary p-button-text p-button-lg desktop-switch'
            onClick={props.onSideBarSwitch}
            tooltip={desktopButtonLabel}
            aria-label={desktopButtonLabel}
          />
        )}
        <span className='layout-top-bar-separator' />
        <div className='top-bar-actions'>
          {actions.map((action, index) => (
            <Button
              key={index}
              icon={action.icon}
              className='p-button-rounded p-button-secondary p-button-text p-button-lg'
              tooltip={action.label}
              tooltipOptions={{
                position: 'left',
              }}
              aria-label={action.label}
              onClick={action.onClick}
            />
          ))}
        </div>
      </header>
      <LogoutDialog logoutDialog={logoutDialog} />
    </>
  );
}
