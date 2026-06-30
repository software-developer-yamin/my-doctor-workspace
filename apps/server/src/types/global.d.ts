
declare module '*.js' {
  const content: any;
  export default content;
  export * from content;
}

declare module 'express-status-monitor';
declare module 'console-log-colors';
declare module 'bwip-js';
