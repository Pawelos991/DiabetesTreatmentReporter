declare module '*.svg' {
  const content: React.ElementType<React.ComponentPropsWithRef<'svg'>>;
  export default content;
}

declare module '*.svg?url' {
  const a: string;
  export default a;
}
