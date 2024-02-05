import React from 'react';
import { locale } from 'dayjs';
import { addLocale } from 'primereact/api';
import { createRoot } from 'react-dom/client';
import * as Yup from 'yup';
import { primeReactPlLocale, yupPlLocale } from '@/constants/locale';
import App from './App';
import { PROJECT_NAME } from './constants';
import './index.scss';
import reportWebVitals from './reportWebVitals';

if (window?.document != null) {
  window.document.title = PROJECT_NAME;
}

addLocale('pl', primeReactPlLocale);
locale('pl');

Yup.setLocale(yupPlLocale);

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  //    <App />,
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
