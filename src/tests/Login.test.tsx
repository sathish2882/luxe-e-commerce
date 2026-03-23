import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Login from "../screens/auth/Login";
import userEvent from "@testing-library/user-event";
import { store } from "../redux/store";
import { Provider } from "react-redux";
import { loginApi } from "../services/authApi";

jest.mock("../services/authApi", () => ({
  loginApi: jest.fn(),
}));

const renderLogin = () => {
  render(
    <Provider store={store}>
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    </Provider>,
  );
};

test("renders signup form fields", () => {
  renderLogin();

  expect(screen.getByLabelText(/^email$/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
});

test("show validation errors when fields are empty", async () => {
  renderLogin();

  const button = screen.getByRole("button", { name: /Login/i });

  await userEvent.click(button);

  expect(
    await screen.findByText(/please enter your email/i),
  ).toBeInTheDocument();
  expect(
    await screen.findByText(/please enter your password/i),
  ).toBeInTheDocument();
});

test("submits form with valid data", async () => {
  (loginApi as jest.Mock).mockResolvedValue({
    success: true,
  });
  renderLogin();

  await userEvent.type(
    screen.getByLabelText(/^email$/i),
    "sathish19222978sk@gmail.com",
  );
  await userEvent.type(screen.getByLabelText(/^password$/i), "sk@1234");

  const button = screen.getByRole("button", { name: /login/i });

  await userEvent.click(button);

  expect(loginApi).toHaveBeenCalled();

  const calledArg = (loginApi as jest.Mock).mock.calls[0][0];
  expect(calledArg.get("email")).toBe("sathish19222978sk@gmail.com");
  expect(calledArg.get("password")).toBe("sk@1234");
});

test("shows error when login fails", async () => {
  (loginApi as jest.Mock).mockRejectedValue({
    message: "Invalid Credentials",
  });
  renderLogin();

  await userEvent.type(
    screen.getByLabelText(/^email$/i),
    "sathish19222978sk@gmail.com",
  );
  await userEvent.type(screen.getByLabelText(/^password$/i), "sk@1234");

  const button = screen.getByRole("button", { name: /login/i });

  await userEvent.click(button);

  expect(loginApi).toHaveBeenCalled();
});
