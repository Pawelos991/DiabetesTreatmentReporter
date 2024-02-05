import { Authority } from '@/api';
import { AppMenuModel, IconType } from '../components/Layout/AppMenu';
import { routes } from './routes';

function link(
  name: string,
  requires: string | string[] | undefined,
  forbiddenFor: string | ((permissions: string[]) => boolean) | string[] | undefined,
  icon: IconType | undefined,
  to: string,
) {
  return {
    to,
    name,
    icon,
    requires,
    forbiddenFor,
  };
}

export const appMenuModel: AppMenuModel = [
  link('Panel główny', undefined, undefined, 'pi pi-home', routes.home),
  link(
    'Raporty',
    [Authority.Patient, Authority.Doctor],
    undefined,
    'pi pi-file-o',
    routes.reports.list,
  ),
  link(
    'Użytkownicy',
    [Authority.Administrator, Authority.Doctor],
    undefined,
    'pi pi-user',
    routes.users.list,
  ),
];
