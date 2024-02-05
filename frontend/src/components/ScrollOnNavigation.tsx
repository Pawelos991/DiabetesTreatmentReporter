import { useEffect } from 'react';
import { useLocation } from 'react-router';

export default function ScrollOnNavigation() {
  const location = useLocation();

  useEffect(() => {
    const scrolled = document.documentElement.scrollTop;
    if (scrolled !== 0) {
      window.scrollTo({
        top: 0,
        behavior: 'auto',
      });
    }
  }, [location.pathname]);

  return null;
}
