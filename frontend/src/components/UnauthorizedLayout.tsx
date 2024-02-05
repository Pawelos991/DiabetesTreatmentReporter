import React from 'react';
import Layout from '@/components/Layout';

// import styles from './UnauthorizedLayout.module.scss';

type Props = {
  children: React.ReactNode;
};

export default function UnauthorizedLayout(props: Props) {
  return <Layout variant='unauthorized'>{props.children}</Layout>;
}
