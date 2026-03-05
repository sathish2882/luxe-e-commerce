import { RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import { createRoot } from "react-dom/client";
import "./index.css";
import { store } from "./redux/store";
import { router } from "./routes/Routes";

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>,
);
