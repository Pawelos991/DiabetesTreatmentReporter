import React from 'react';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <Card>
      <h1>{t('pageNotFound')}</h1>
      <Button
        icon='pi pi-undo'
        label='Powrót'
        className='p-button-info p-button-text'
        onClick={() => navigate(-1)}
      />
    </Card>
  );
}
