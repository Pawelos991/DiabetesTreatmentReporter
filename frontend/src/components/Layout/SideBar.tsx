import React from 'react';
import { Card } from 'primereact/card';
import { ScrollPanel } from 'primereact/scrollpanel';
import { Sidebar } from 'primereact/sidebar';
import { classNames } from 'primereact/utils';
import { useAuthContext } from '@/components/providers/AuthProvider';
import AppMenu from './AppMenu';
import './SideBar.scss';

type Props = {
  visibleDesktop: boolean;
};

export default function SideBar(props: Props) {
  const { user } = useAuthContext();

  const content = (
    <ScrollPanel>
      <div className='layout-side-bar-content'>
        <div className='user-info'>
          <div className='name'>{user?.name + ' ' + user?.surname}</div>
          <hr className='mb-3 mx-0 border-top-1 border-bottom-none border-300 mt-auto' />
        </div>
        <AppMenu />
      </div>
    </ScrollPanel>
  );

  return (
    <>
      <Card
        className={classNames('layout-side-bar', {
          collapsed: !props.visibleDesktop,
        })}
        aria-expanded={props.visibleDesktop}
      >
        {content}
      </Card>
      <Sidebar onHide={() => {}} className='layout-side-bar'>
        {content}
      </Sidebar>
    </>
  );
}
