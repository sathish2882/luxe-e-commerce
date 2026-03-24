import Profile from "../screens/Profile";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

const mockNavigate = jest.fn();

jest.mock("js-cookie", () => ({
  get: jest.fn(),
  remove: jest.fn(),
}));

jest.mock("../services/authApi", () => ({
  userInfoApi: jest.fn(),
}));

jest.mock("react-toastify", () => ({
  toast: {
    error: jest.fn(),
  },
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

import Cookies from "js-cookie";
import { userInfoApi } from "../services/authApi";
import { toast } from "react-toastify";

const renderProfile = () => {
  render(
    <MemoryRouter>
      <Profile />
    </MemoryRouter>,
  );
};

beforeEach(() => {
  jest.clearAllMocks();
});

test("renders orders link", () => {
  renderProfile();

  expect(screen.getByRole("link", { name: /orders/i })).toHaveAttribute(
    "href",
    "/orders",
  );
});

test("shows login button when user is not logged in", () => {
  (Cookies.get as jest.Mock).mockReturnValue(undefined);

  renderProfile();

  expect(
    screen.getByRole("button", { name: /login \/ signup/i }),
  ).toBeInTheDocument();
});

test("navigates to login when login button is clicked", async () => {
  (Cookies.get as jest.Mock).mockReturnValue(undefined);

  renderProfile();

  await userEvent.click(
    screen.getByRole("button", { name: /login \/ signup/i }),
  );

  expect(mockNavigate).toHaveBeenCalledWith("/login");
});

test("fetches and shows user info when token exists", async () => {
  (Cookies.get as jest.Mock).mockReturnValue("token");
  (userInfoApi as jest.Mock).mockResolvedValue({
    data: {
      username: "sathish",
      email: "sathish19222978sk@gmail.com",
    },
  });

  renderProfile();

  expect(await screen.findByText(/^sathish$/i)).toBeInTheDocument();
  expect(screen.getByText(/sathish1\*\*\*@gmail\.com/i)).toBeInTheDocument();
});

test("shows logout button when user is logged in", async () => {
  (Cookies.get as jest.Mock).mockReturnValue("token");
  (userInfoApi as jest.Mock).mockResolvedValue({
    data: {
      username: "sathish",
      email: "sathish19222978sk@gmail.com",
    },
  });

  renderProfile();

  expect(
    await screen.findByRole("button", { name: /logout/i }),
  ).toBeInTheDocument();
});

test("logout removes cookies and navigates home", async () => {
  (Cookies.get as jest.Mock).mockReturnValue("token");
  (userInfoApi as jest.Mock).mockResolvedValue({
    data: {
      username: "sathish",
      email: "sathish19222978sk@gmail.com",
    },
  });

  renderProfile();

  await userEvent.click(await screen.findByRole("button", { name: /logout/i }));

  expect(Cookies.remove).toHaveBeenCalledWith("token");
  expect(Cookies.remove).toHaveBeenCalledWith("userType");
  expect(mockNavigate).toHaveBeenCalledWith("/", { replace: true });
});

test("shows error toast when user fetch fails", async () => {
  (Cookies.get as jest.Mock).mockReturnValue("token");
  (userInfoApi as jest.Mock).mockRejectedValue({
    response: {
      data: {
        detail: "Failed to fetch user",
      },
    },
  });

  renderProfile();

  await waitFor(() => {
    expect(toast.error).toHaveBeenCalledWith("Failed to fetch user");
  });
});
