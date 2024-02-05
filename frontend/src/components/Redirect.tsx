import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useLocation } from 'react-router-dom';

export function Redirect(props: { to: string }) {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const pathname = location.pathname;

    if (pathname != null && pathname !== '/') {
      navigate(`${props.to}?origin=${encodeURIComponent(location.pathname)}`);
    } else {
      navigate(props.to);
    }
  }, []);

  return <> </>;
}
