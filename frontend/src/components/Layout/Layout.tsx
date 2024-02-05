import React, { ReactNode, useCallback, useState } from 'react';
import { classNames } from 'primereact/utils';
import { layoutIds } from '@/constants/layoutIds';
import Footer from './Footer';
import './Layout.scss';
import SideBar from './SideBar';
import TopBar from './TopBar';

type LayoutProps = {
  children: ReactNode;
  variant?: 'unauthorized' | 'authorized';
};

export default function Layout(props: LayoutProps) {
  const variant = props.variant ?? 'authorized';

  const [sideBarVisibleDesktop, setSideBarVisibleDesktop] = useState<boolean>(true);
  const onSideBarSwitchDesktop = useCallback(() => {
    setSideBarVisibleDesktop(!sideBarVisibleDesktop);
  }, [sideBarVisibleDesktop]);

  return (
    <div className='layout-wrapper'>
      <TopBar
        variant={variant}
        visibleDesktop={sideBarVisibleDesktop}
        onSideBarSwitch={onSideBarSwitchDesktop}
      />
      {variant === 'authorized' && <SideBar visibleDesktop={sideBarVisibleDesktop} />}
      <div
        className={classNames('layout-content', {
          'side-bar-collapsed': !sideBarVisibleDesktop || variant === 'unauthorized',
        })}
      >
        <main id={layoutIds.content} className={`variant-${variant}`}>
          {props.children}
        </main>
        <Footer />
      </div>
    </div>
  );
}
