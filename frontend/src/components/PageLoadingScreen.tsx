import React from 'react';
import { ProgressBar } from 'primereact/progressbar';
import { useTranslation } from 'react-i18next';

export default function PageLoadingScreen() {
  const { t } = useTranslation();
  return (
    <>
      <h1 style={{ fontSize: '1rem', color: 'var(--text-color)' }}>{t('pageLoading')}</h1>
      <ProgressBar mode='indeterminate' />
    </>
  );
}
