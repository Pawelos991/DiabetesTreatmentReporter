import React, { ComponentPropsWithRef, ElementType, useState } from 'react';
import { classNames } from 'primereact/utils';
import { Link, Location as RouterLocation, useLocation } from 'react-router-dom';
import { UserResponse } from '@/api';
import { useAuthContext } from '@/components/providers/AuthProvider';
import { layoutIds } from '@/constants/layoutIds';
import { appMenuModel } from '../../constants/appMenuModel';

type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

export type IconType = string | ElementType<ComponentPropsWithRef<'svg'>>;

export type AppMenuModel = {
  name: string;
  to?: string;
  items?: AppMenuModel;
  icon?: IconType;
  requires?: string | string[];
  forbiddenFor?: string | ((permissions: string[]) => boolean) | string[];
}[];

export function shouldBeDisplayed(item: ArrayElement<AppMenuModel>, user?: UserResponse) {
  // blokuje wyświetlanie itemu, dla którego nie mamy uprawnień
  if (item.requires !== undefined) {
    const role = user?.role;
    if (role) {
      if (item.requires instanceof Array) {
        if (!item.requires.includes(role.toUpperCase())) {
          return false;
        }
      } else if (role.toUpperCase() !== item.requires) {
        return false;
      }
    }
  }

  // blokuje wyświetlanie itemu, dla którego nie wyświetla się żadnego z jego dzieci
  if (item.items) {
    const isAnyChildItemRendered =
      item.items.filter((itemF) => shouldBeDisplayed(itemF, user)).length > 0;
    if (!isAnyChildItemRendered) {
      return false;
    }
  }

  return true;
}

function itemContents(item: ArrayElement<AppMenuModel>) {
  return (
    <>
      {typeof item.icon === 'string' || item.icon == null ? (
        <i className={item.icon ?? 'pi pi-chevron-right'} />
      ) : (
        <item.icon
          style={{
            height: '1em',
            width: '1em',
            scale: '1.4',
            filter: 'invert(0.3)',
          }}
        />
      )}
      <span className='menu-item-label'>{item.name}</span>
      {item.items != null && <i className='pi pi-angle-up collapse-icon' />}
    </>
  );
}

function AppSubMenuItem(props: {
  item: ArrayElement<AppMenuModel>;
  location: RouterLocation;
  user?: UserResponse;
}) {
  const [collapsed, setCollapsed] = useState<boolean>(false);

  const containerClassNames = classNames('menu-item-container', {
    collapsed: collapsed,
    current: window.location.pathname === props.item.to,
  });

  if (shouldBeDisplayed(props.item, props.user)) {
    return (
      <li>
        {props.item.to != null ? (
          <Link to={props.item.to} className={containerClassNames}>
            {itemContents(props.item)}
          </Link>
        ) : (
          <div className={containerClassNames} onClick={() => setCollapsed(!collapsed)}>
            {itemContents(props.item)}
          </div>
        )}
        {props.item.items != null && (
          // eslint-disable-next-line @typescript-eslint/no-use-before-define
          <AppSubMenu
            model={props.item.items}
            collapsed={collapsed}
            location={props.location}
          />
        )}
      </li>
    );
  } else {
    return <></>;
  }
}

function AppSubMenu(props: {
  model: AppMenuModel;
  collapsed?: boolean;
  location: RouterLocation;
  user?: UserResponse;
}) {
  return (
    <ul
      className={classNames('layout-sub-menu', {
        collapsed: props.collapsed,
      })}
    >
      {props.model.map((item, i) => (
        <AppSubMenuItem key={i} item={item} location={props.location} user={props.user} />
      ))}
    </ul>
  );
}

export default function AppMenu() {
  const location = useLocation();
  const { user } = useAuthContext();
  return (
    <menu id={layoutIds.sideMenu}>
      <AppSubMenu model={appMenuModel} location={location} user={user} />
    </menu>
  );
}
