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