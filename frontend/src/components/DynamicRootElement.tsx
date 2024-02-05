import React, { ReactNode, useEffect, useState } from 'react';

export default function DynamicRootElement(props: {
  children: (element: HTMLElement | null) => ReactNode;
}) {
  const [rootElement, setRootElement] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (rootElement == null) {
      return;
    }

    const assignPosition = (el: HTMLElement) => {
      el.style.top = -window.scrollY + 'px';
      el.style.left = -window.scrollX + 'px';
    };

    rootElement.style.position = 'absolute';
    rootElement.style.zIndex = '1';
    assignPosition(rootElement);

    const event = () => {
      assignPosition(rootElement);
    };

    window.addEventListener('scroll', event);
    return () => window.removeEventListener('scroll', event);
  }, [rootElement]);

  return (
    <>
      {props.children(rootElement)}
      <div ref={(el) => setRootElement(el)} />
    </>
  );
}
