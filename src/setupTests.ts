import "@testing-library/jest-dom"
import { TextEncoder, TextDecoder } from "util";

Object.assign(global, {
  TextEncoder,
  TextDecoder,
});

Object.defineProperty(window, "appConfig", {
  value: {
    baseURL: "http://localhost:3000",
  },
  writable: true,
});

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: any) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }),
});