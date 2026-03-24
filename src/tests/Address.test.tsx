import Address from "../screens/Address";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

jest.mock("../services/authApi", () => ({
  createAddress: jest.fn(),
}));

import { createAddress } from "../services/authApi";

const renderAddress = () => {
  render(
    <MemoryRouter>
      <Address />
    </MemoryRouter>,
  );
};

beforeEach(() => {
  jest.clearAllMocks();
});

test("Address renders correctly", () => {
  renderAddress();

  expect(screen.getByText(/add new address/i)).toBeInTheDocument();
});

test("renders address form fields", async () => {
  renderAddress();

  const button = screen.getByLabelText("add address");

  await userEvent.click(button);

  expect(screen.getByLabelText(/^address line1$/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/^address line2$/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/^city$/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/^state$/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/^country$/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/^pincode$/i)).toBeInTheDocument();
});

test("show validation errors when fields are empty", async () => {
  renderAddress();

  const button = screen.getByLabelText("add address");

  await userEvent.click(button);

  expect(
    await screen.findByText(/please enter address line 1/i),
  ).toBeInTheDocument();
  expect(
    await screen.findByText(/please enter address line 2/i),
  ).toBeInTheDocument();
  expect(
    await screen.findByText(/please enter city name/i),
  ).toBeInTheDocument();
  expect(
    await screen.findByText(/please enter state name/i),
  ).toBeInTheDocument();
  expect(
    await screen.findByText(/please enter country name/i),
  ).toBeInTheDocument();
  expect(await screen.findByText(/please enter pincode/i)).toBeInTheDocument();
});

test("submits form with valid data", async () => {
  (createAddress as jest.Mock).mockResolvedValue({
    data: { success: true },
  });

  renderAddress();

  fireEvent.change(screen.getByLabelText(/^address line1$/i), {
    target: { value: "4/86, car street" },
  });
  fireEvent.change(screen.getByLabelText(/^address line2$/i), {
    target: { value: "KCT techpark opposite, saravanampatty" },
  });
  fireEvent.change(screen.getByLabelText(/^city$/i), {
    target: { value: "coimbatore" },
  });
  fireEvent.change(screen.getByLabelText(/^state$/i), {
    target: { value: "tamilnadu" },
  });
  fireEvent.change(screen.getByLabelText(/^country$/i), {
    target: { value: "india" },
  });
  fireEvent.change(screen.getByLabelText(/^pincode$/i), {
    target: { value: "636010" },
  });

  fireEvent.click(screen.getByLabelText("add address"));

  await waitFor(() => {
    expect(createAddress).toHaveBeenCalled();
  });

  const calledArg = (createAddress as jest.Mock).mock.calls[0][0];
  expect(calledArg.get("address_line1")).toBe("4/86, car street");
  expect(calledArg.get("address_line2")).toBe(
    "KCT techpark opposite, saravanampatty",
  );
  expect(calledArg.get("city")).toBe("coimbatore");
  expect(calledArg.get("state")).toBe("tamilnadu");
  expect(calledArg.get("country")).toBe("india");
  expect(calledArg.get("pincode")).toBe("636010");

  expect(mockNavigate).toHaveBeenCalledWith("/cart");
});

test("shows error when login fails", async () => {
  (createAddress as jest.Mock).mockRejectedValue({
    message: "Invalid Credentials",
  });

  renderAddress();

  fireEvent.change(screen.getByLabelText(/^address line1$/i), {
    target: { value: "4/86, car street" },
  });
  fireEvent.change(screen.getByLabelText(/^address line2$/i), {
    target: { value: "KCT techpark opposite, saravanampatty" },
  });
  fireEvent.change(screen.getByLabelText(/^city$/i), {
    target: { value: "coimbatore" },
  });
  fireEvent.change(screen.getByLabelText(/^state$/i), {
    target: { value: "tamilnadu" },
  });
  fireEvent.change(screen.getByLabelText(/^country$/i), {
    target: { value: "india" },
  });
  fireEvent.change(screen.getByLabelText(/^pincode$/i), {
    target: { value: "636010" },
  });

  fireEvent.click(screen.getByLabelText("add address"));

  await waitFor(() => {
    expect(createAddress).toHaveBeenCalled();
  });
});
