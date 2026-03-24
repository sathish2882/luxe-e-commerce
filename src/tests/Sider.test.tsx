import Sidebar from "../components/sidebar/Sidebar";
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

const renderSidebar = () => {
  render(
    <MemoryRouter>
      <Sidebar />
    </MemoryRouter>,
  );
};

beforeEach(() => {
  jest.clearAllMocks();
});

test("Sidebar renders logo and menu items", () => {
  renderSidebar();

  expect(screen.getByText(/luxe/i)).toBeInTheDocument();
  expect(screen.getByText(/admin panel/i)).toBeInTheDocument();
  expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
  expect(screen.getByText(/products/i)).toBeInTheDocument();
  expect(screen.getByText(/categories/i)).toBeInTheDocument();
});

test("fetches and shows user info when token exists", async () => {
  (Cookies.get as jest.Mock).mockReturnValue("token");
  (userInfoApi as jest.Mock).mockResolvedValue({
    data: {
      username: "admin",
      email: "admin@gmail.com",
    },
  });

  renderSidebar();

  expect(await screen.findByText(/admin/i)).toBeInTheDocument();
  expect(screen.getByText("admin@gmai...")).toBeInTheDocument();
});

test("does not fetch user info when token is missing", () => {
  (Cookies.get as jest.Mock).mockReturnValue(undefined);

  renderSidebar();

  expect(userInfoApi).not.toHaveBeenCalled();
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

  renderSidebar();

  await waitFor(() => {
    expect(toast.error).toHaveBeenCalledWith("Failed to fetch user");
  });
});

test("logout removes cookies and navigates home", async () => {
  (Cookies.get as jest.Mock).mockReturnValue("token");
  (userInfoApi as jest.Mock).mockResolvedValue({
    data: {
      username: "admin",
      email: "admin@gmail.com",
    },
  });

  renderSidebar();

  await userEvent.click(await screen.findByRole("button", { name: /logout/i }));

  expect(Cookies.remove).toHaveBeenCalledWith("token");
  expect(Cookies.remove).toHaveBeenCalledWith("userType");
  expect(mockNavigate).toHaveBeenCalledWith("/");
});
