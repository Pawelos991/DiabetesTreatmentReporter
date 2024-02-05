import React from 'react';
import i18n from 'i18next';
import { ProgressBar } from 'primereact/progressbar';

function getMessage(lang: string) {
  switch (lang.toLowerCase()) {
    case 'pl':
    default:
      return 'Ładowanie aplikacji...';
  }
}

export default function LoadingScreen() {
  const lang = i18n.language;
  return (
    <div style={{ padding: '1rem', color: 'var(--text-color)' }}>
      <h1 style={{ fontSize: '1rem' }}>{getMessage(lang)} </h1>
      <ProgressBar mode='indeterminate' />
    </div>
  );
}
