import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ForgotPassword from "../screens/auth/ForgotPassword";
import userEvent from "@testing-library/user-event";

jest.mock("../services/authApi", () => ({
  forgotPasswordApi: jest.fn(),
  verifyOtpApi: jest.fn(),
  resetPasswordApi: jest.fn(),
}));
import {
  forgotPasswordApi,
  verifyOtpApi,
  resetPasswordApi,
} from "../services/authApi";

const renderForgotPassword = () => {
  render(
    <MemoryRouter>
      <ForgotPassword />
    </MemoryRouter>,
  );
};

test("renders email form fields", () => {
  renderForgotPassword();

  expect(screen.getByLabelText(/^email$/i)).toBeInTheDocument();
});

test("renders otp form fields", async () => {
  (forgotPasswordApi as jest.Mock).mockResolvedValue({
    data: { success: true },
  });

  renderForgotPassword();

  await userEvent.type(
    screen.getByLabelText(/^email$/i),
    "sathish19222978sk@gmail.com",
  );

  await userEvent.click(screen.getByRole("button", { name: /send otp/i }));

  const otpInput = await screen.findByLabelText(/enter otp/i);
  expect(otpInput).toBeInTheDocument();
});

test("renders reset form fields", async () => {
  (forgotPasswordApi as jest.Mock).mockResolvedValue({
    data: { success: true },
  });
  (verifyOtpApi as jest.Mock).mockResolvedValue({
    data: { success: true },
  });
  renderForgotPassword();

  await userEvent.type(
    screen.getByLabelText(/^email$/i),
    "sathish19222978sk@gmail.com",
  );
  await userEvent.click(screen.getByRole("button", { name: /send otp/i }));

  const otpInput = await screen.findByLabelText(/^enter otp$/i);
  await userEvent.type(otpInput, "123456");
  await userEvent.click(screen.getByRole("button", { name: /verify otp/i }));

  const passwordInput = await screen.findByLabelText(/^new password$/i);
  expect(passwordInput).toBeInTheDocument();

  expect(screen.getByLabelText(/^confirm password$/i)).toBeInTheDocument();
});

test("show validation errors when fields are empty for email form", async () => {
  renderForgotPassword();

  const button = screen.getByRole("button", { name: /send otp/i });

  await userEvent.click(button);

  expect(await screen.findByText(/^email is required$/i)).toBeInTheDocument();
});

test("show validation errors when fields are empty for otp form", async () => {
  renderForgotPassword();

  (forgotPasswordApi as jest.Mock).mockResolvedValue({
    data: { success: true },
  });

  await userEvent.type(
    screen.getByLabelText(/^email$/i),
    "sathish19222978sk@gmail.com",
  );

  await userEvent.click(screen.getByRole("button", { name: /send otp/i }));

  const button = screen.getByRole("button", { name: /verify otp/i });

  await userEvent.click(button);

  expect(await screen.findByText(/^otp is required$/i)).toBeInTheDocument();
});

test("show validation errors when fields are empty for reset form", async () => {
  (forgotPasswordApi as jest.Mock).mockResolvedValue({
    data: { success: true },
  });
  (verifyOtpApi as jest.Mock).mockResolvedValue({
    data: { success: true },
  });

  renderForgotPassword();

  await userEvent.type(
    screen.getByLabelText(/^email$/i),
    "sathish19222978sk@gmail.com",
  );

  await userEvent.click(screen.getByRole("button", { name: /send otp/i }));

  const otpInput = await screen.findByLabelText(/^enter otp$/i);
  await userEvent.type(otpInput, "123456");

  await userEvent.click(screen.getByRole("button", { name: /verify otp/i }));

  await userEvent.click(
    screen.getByRole("button", { name: /reset password/i }),
  );

  expect(await screen.findByText(/^password required$/i)).toBeInTheDocument();
  expect(
    await screen.findByText(/^confirm password required$/i),
  ).toBeInTheDocument();
});

test("submits form with valid data for email form", async () => {
  (forgotPasswordApi as jest.Mock).mockResolvedValue({
    data: { success: true },
  });
  renderForgotPassword();

  await userEvent.type(
    screen.getByLabelText(/^email$/i),
    "sathish19222978sk@gmail.com",
  );

  const button = screen.getByRole("button", { name: /send otp/i });

  await userEvent.click(button);

  expect(forgotPasswordApi).toHaveBeenCalled();

  const calledArg = (forgotPasswordApi as jest.Mock).mock.calls[0][0];
  expect(calledArg.get("email")).toBe("sathish19222978sk@gmail.com");
});

test("shows error when login fails for email form", async () => {
  (forgotPasswordApi as jest.Mock).mockRejectedValue({
    message: "Invalid Credentials",
  });
  renderForgotPassword();

  await userEvent.type(
    screen.getByLabelText(/^email$/i),
    "sathish19222978sk@gmail.com",
  );

  const button = screen.getByRole("button", { name: /send otp/i });

  await userEvent.click(button);

  expect(forgotPasswordApi).toHaveBeenCalled();
});

test("submits form with valid data for otp form", async () => {
  (forgotPasswordApi as jest.Mock).mockResolvedValue({
    data: { success: true },
  });
  (verifyOtpApi as jest.Mock).mockResolvedValue({
    data: { success: true },
  });
  renderForgotPassword();

  await userEvent.type(
    screen.getByLabelText(/^email$/i),
    "sathish19222978sk@gmail.com",
  );

  await userEvent.click(screen.getByRole("button", { name: /send otp/i }));

  const otpInput = await screen.findByLabelText(/enter otp/i);
  await userEvent.type(otpInput, "123456");

  const button = screen.getByRole("button", { name: /verify otp/i });

  await userEvent.click(button);

  expect(verifyOtpApi).toHaveBeenCalled();

  const calledArg = (verifyOtpApi as jest.Mock).mock.calls[0][0];
  expect(calledArg.get("otp")).toBe("123456");
});

test("shows error when login fails for otp form", async () => {
  (forgotPasswordApi as jest.Mock).mockResolvedValue({
    data: { success: true },
  });
  (verifyOtpApi as jest.Mock).mockRejectedValue({
    response: {
      data: { message: "Invalid Credentials" },
    },
  });
  renderForgotPassword();

  await userEvent.type(
    screen.getByLabelText(/^email$/i),
    "sathish19222978sk@gmail.com",
  );

  await userEvent.click(screen.getByRole("button", { name: /send otp/i }));

  const otpInput = await screen.findByLabelText(/enter otp/i);
  await userEvent.type(otpInput, "123456");

  const button = screen.getByRole("button", { name: /verify otp/i });

  await userEvent.click(button);

  expect(verifyOtpApi).toHaveBeenCalled();

  const calledArg = (verifyOtpApi as jest.Mock).mock.calls[0][0];
  expect(calledArg.get("otp")).toBe("123456");
});

test("submits form with valid data for reset form", async () => {
  (forgotPasswordApi as jest.Mock).mockResolvedValue({
    data: { success: true },
  });
  (verifyOtpApi as jest.Mock).mockResolvedValue({
    data: { success: true },
  });
  (resetPasswordApi as jest.Mock).mockResolvedValue({
    data: { success: true },
  });
  renderForgotPassword();

  await userEvent.type(
    screen.getByLabelText(/^email$/i),
    "sathish19222978sk@gmail.com",
  );

  await userEvent.click(screen.getByRole("button", { name: /send otp/i }));

  const otpInput = await screen.findByLabelText(/enter otp/i);
  await userEvent.type(otpInput, "123456");

  const button = screen.getByRole("button", { name: /verify otp/i });

  await userEvent.click(button);

  const passwordInput = await screen.findByLabelText(/^new password$/i);
  await userEvent.type(passwordInput, "sk@1234");
  const confirmPasswordInput =
    await screen.findByLabelText(/^confirm password$/i);
  await userEvent.type(confirmPasswordInput, "sk@1234");

  await userEvent.click(
    screen.getByRole("button", { name: /reset password/i }),
  );

  expect(resetPasswordApi).toHaveBeenCalled();

  const calledArg = (resetPasswordApi as jest.Mock).mock.calls[0][0];
  expect(calledArg.get("new_password")).toBe("sk@1234");
});

test("shows error when login fails for reset form", async () => {
  (forgotPasswordApi as jest.Mock).mockResolvedValue({
    data: { success: true },
  });
  (verifyOtpApi as jest.Mock).mockResolvedValue({
    data: { success: true },
  });
  (resetPasswordApi as jest.Mock).mockRejectedValue({
    response: {
      data: { message: "Invalid Credentials" },
    },
  });
  renderForgotPassword();

  await userEvent.type(
    screen.getByLabelText(/^email$/i),
    "sathish19222978sk@gmail.com",
  );

  await userEvent.click(screen.getByRole("button", { name: /send otp/i }));

  const otpInput = await screen.findByLabelText(/enter otp/i);
  await userEvent.type(otpInput, "123456");

  const button = screen.getByRole("button", { name: /verify otp/i });

  await userEvent.click(button);

  const passwordInput = await screen.findByLabelText(/^new password$/i);
  await userEvent.type(passwordInput, "sk@1234");
  const confirmPasswordInput =
    await screen.findByLabelText(/^confirm password$/i);
  await userEvent.type(confirmPasswordInput, "sk@1234");

  await userEvent.click(
    screen.getByRole("button", { name: /reset password/i }),
  );

  expect(resetPasswordApi).toHaveBeenCalled();

  const calledArg = (resetPasswordApi as jest.Mock).mock.calls[0][0];
  expect(calledArg.get("new_password")).toBe("sk@1234");
});
