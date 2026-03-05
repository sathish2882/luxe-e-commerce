export {};

declare global {
  interface Window {
    appConfig: {
      baseURL: string;
    };
  }
}