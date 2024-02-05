import { useLayoutEffect } from 'react';
import { PROJECT_NAME } from '@/constants';

export type PageTitleProps = {
  children: string;
};

export default function PageTitle(props: PageTitleProps) {
  useLayoutEffect(() => {
    const previousTitle = window.document.title;
    window.document.title = `${props.children} - ${PROJECT_NAME}`;
    return () => {
      window.document.title = previousTitle;
    };
  }, []);
  return null;
}
