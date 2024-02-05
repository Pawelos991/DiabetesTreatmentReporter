import React from 'react';
import { PROJECT_NAME, PROJECT_VERSION } from '../../constants';
import { isCorrectVersion } from '../../utils/isCorrectVersion';
import './Footer.scss';

export default function Footer() {
  return (
    <footer className='layout-footer'>
      <div className='closing-element left' />
      <div className='project-name'>{PROJECT_NAME}</div>
      <div className='closing-element right version'>
        {isCorrectVersion(PROJECT_VERSION) && (
          <>
            {'Wersja systemu: '}
            <span>{PROJECT_VERSION}</span>
          </>
        )}
      </div>
    </footer>
  );
}
