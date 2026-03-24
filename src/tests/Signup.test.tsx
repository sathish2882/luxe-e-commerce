import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Signup from "../screens/auth/Signup";
import userEvent from "@testing-library/user-event";
import { signupApi } from "../services/authApi";

jest.mock("../services/authApi", () => ({
  signupApi: jest.fn(),
}));

const renderSignup = () => {
  render(
    <MemoryRouter>
      <Signup />
    </MemoryRouter>,
  );
};

test("renders signup form fields", () => {
  renderSignup();
  expect(screen.getByLabelText(/^username$/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/^email$/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/^confirm password$/i)).toBeInTheDocument();
});

test("show validation errors when fields are empty", async () => {
  renderSignup();

  const button = screen.getByRole("button", { name: /sign up/i });

  await userEvent.click(button);

  expect(
    await screen.findByText(/please enter your username/i),
  ).toBeInTheDocument();
  expect(
    await screen.findByText(/please enter your email/i),
  ).toBeInTheDocument();
  expect(
    await screen.findByText(/please enter your password/i),
  ).toBeInTheDocument();
});

test("shows error when password do not match", async () => {
  renderSignup();

  await userEvent.type(screen.getByLabelText(/^password$/i), "Test@1234");
  await userEvent.type(
    screen.getByLabelText(/^confirm password$/i),
    "Wrong@1234",
  );
  await userEvent.click(screen.getByRole("button", { name: /sign up/i }));

  expect(await screen.findByText(/passwords must match/i)).toBeInTheDocument();
});

test("submits form with valid data", async () => {
  (signupApi as jest.Mock).mockResolvedValue({
    success: true,
  });
  renderSignup();

  await userEvent.type(screen.getByLabelText(/^username$/i), "sathish");
  await userEvent.type(
    screen.getByLabelText(/^email$/i),
    "sathish19222978sk@gmail.com",
  );
  await userEvent.type(screen.getByLabelText(/^password$/i), "sk@1234");
  await userEvent.type(screen.getByLabelText(/^confirm password$/i), "sk@1234");

  const button = screen.getByRole("button", { name: /sign up/i });

  await userEvent.click(button);

  expect(signupApi).toHaveBeenCalled();

  const calledArg = (signupApi as jest.Mock).mock.calls[0][0];
  expect(calledArg.get("username")).toBe("sathish");
  expect(calledArg.get("email")).toBe("sathish19222978sk@gmail.com");
  expect(calledArg.get("password")).toBe("sk@1234");
});

test("shows error when signup fails", async () => {
  (signupApi as jest.Mock).mockRejectedValue({
    message: "Invalid Credentials",
  });
  renderSignup();

  await userEvent.type(screen.getByLabelText(/^username$/i), "sathish");
  await userEvent.type(
    screen.getByLabelText(/^email$/i),
    "sathish19222978sk@gmail.com",
  );
  await userEvent.type(screen.getByLabelText(/^password$/i), "sk@1234");
  await userEvent.type(screen.getByLabelText(/^confirm password$/i), "sk@1234");

  const button = screen.getByRole("button", { name: /sign up/i });

  await userEvent.click(button);

  expect(signupApi).toHaveBeenCalled();
});

test("renders login link", () => {
  renderSignup();

  expect(screen.getByRole("link", { name: /login/i })).toHaveAttribute(
    "href",
    "/login",
  );
});

test("shows invalid email validation", async () => {
  renderSignup();

  await userEvent.type(screen.getByLabelText(/^username$/i), "sathish");
  await userEvent.type(screen.getByLabelText(/^email$/i), "invalid-email");
  await userEvent.type(screen.getByLabelText(/^password$/i), "sk@1234");
  await userEvent.type(screen.getByLabelText(/^confirm password$/i), "sk@1234");

  await userEvent.click(screen.getByRole("button", { name: /sign up/i }));

  expect(await screen.findByText(/invalid email/i)).toBeInTheDocument();
});

test("shows password min length validation", async () => {
  renderSignup();

  await userEvent.type(screen.getByLabelText(/^username$/i), "sathish");
  await userEvent.type(
    screen.getByLabelText(/^email$/i),
    "sathish19222978sk@gmail.com",
  );
  await userEvent.type(screen.getByLabelText(/^password$/i), "123");
  await userEvent.type(screen.getByLabelText(/^confirm password$/i), "123");

  await userEvent.click(screen.getByRole("button", { name: /sign up/i }));

  expect(
    await screen.findByText(/password must be at least 6 characters/i),
  ).toBeInTheDocument();
});
