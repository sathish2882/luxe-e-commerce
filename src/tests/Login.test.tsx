import { render, screen, act, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Login from "../screens/auth/Login";
import userEvent from "@testing-library/user-event";
import { store } from "../redux/store";
import { Provider } from "react-redux";
import { loginApi, resendOtpApi } from "../services/authApi";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

jest.mock("../services/authApi", () => ({
  loginApi: jest.fn(),
  resendOtpApi: jest.fn(),
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

test("shows invalid email validation", async () => {
  renderLogin();

  await userEvent.type(screen.getByLabelText(/^email$/i), "invalid-email");
  await userEvent.type(screen.getByLabelText(/^password$/i), "sk@1234");
  await userEvent.click(screen.getByRole("button", { name: /login/i }));

  expect(await screen.findByText(/invalid email/i)).toBeInTheDocument();
});

test("shows password min length validation", async () => {
  renderLogin();

  await userEvent.type(screen.getByLabelText(/^email$/i), "test@gmail.com");
  await userEvent.type(screen.getByLabelText(/^password$/i), "123");
  await userEvent.click(screen.getByRole("button", { name: /login/i }));

  expect(
    await screen.findByText(/password must be at least 6 characters/i),
  ).toBeInTheDocument();
});

test("navigates to forgot password page", async () => {
  renderLogin();

  await userEvent.click(
    screen.getByRole("button", { name: /forgot password/i }),
  );

  expect(mockNavigate).toHaveBeenCalledWith("/forgot-password");
});

test("renders signup link", () => {
  renderLogin();

  const signupLink = screen.getByRole("link", { name: /sign up/i });
  expect(signupLink).toHaveAttribute("href", "/signup");
});

test("shows otp form when login returns otp_key", async () => {
  (loginApi as jest.Mock).mockResolvedValue({
    data: {
      otp_key: "otp-key-1",
      timer: 60,
    },
  });

  renderLogin();

  await userEvent.type(screen.getByLabelText(/^email$/i), "test@gmail.com");
  await userEvent.type(screen.getByLabelText(/^password$/i), "sk@1234");
  await userEvent.click(screen.getByRole("button", { name: /login/i }));

  expect(await screen.findByLabelText(/enter otp/i)).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: /verify otp/i }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: /resend otp/i }),
  ).toBeInTheDocument();
});

test("verify otp button is disabled when otp is empty", async () => {
  (loginApi as jest.Mock).mockResolvedValue({
    data: {
      otp_key: "otp-key-1",
      timer: 60,
    },
  });

  renderLogin();

  await userEvent.type(screen.getByLabelText(/^email$/i), "test@gmail.com");
  await userEvent.type(screen.getByLabelText(/^password$/i), "sk@1234");
  await userEvent.click(screen.getByRole("button", { name: /login/i }));

  const resendBtn = await screen.findByRole("button", { name: /resend otp/i });

  expect(resendBtn).toBeDisabled();
  expect(resendOtpApi).not.toHaveBeenCalled();
});

test("shows otp validation for invalid otp", async () => {
  (loginApi as jest.Mock).mockResolvedValue({
    data: {
      otp_key: "otp-key-1",
      timer: 60,
    },
  });

  renderLogin();

  await userEvent.type(screen.getByLabelText(/^email$/i), "test@gmail.com");
  await userEvent.type(screen.getByLabelText(/^password$/i), "sk@1234");
  await userEvent.click(screen.getByRole("button", { name: /login/i }));

  await userEvent.type(await screen.findByLabelText(/enter otp/i), "123");
  await userEvent.click(screen.getByRole("button", { name: /verify otp/i }));

  expect(await screen.findByText(/otp must be 6 digits/i)).toBeInTheDocument();
});

test("resends otp after timer expires", async () => {
  jest.useFakeTimers();

  (loginApi as jest.Mock).mockResolvedValue({
    data: {
      otp_key: "otp-key-1",
      timer: 1,
    },
  });

  (resendOtpApi as jest.Mock).mockResolvedValue({
    data: { timer: 60 },
  });

  renderLogin();

  fireEvent.change(screen.getByLabelText(/^email$/i), {
    target: { value: "test@gmail.com" },
  });

  fireEvent.change(screen.getByLabelText(/^password$/i), {
    target: { value: "sk@1234" },
  });

  fireEvent.click(screen.getByRole("button", { name: /login/i }));

  const resendButton = await screen.findByRole("button", {
    name: /resend otp/i,
  });

  expect(resendButton).toBeDisabled();

  act(() => {
    jest.advanceTimersByTime(1000);
  });

  expect(resendButton).not.toBeDisabled();

  fireEvent.click(resendButton);

  expect(resendOtpApi).toHaveBeenCalled();

  jest.useRealTimers();
});
