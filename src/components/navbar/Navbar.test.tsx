import {render,screen} from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import Navbar from "./Navbar"
import userEvent from "@testing-library/user-event"

jest.mock("../../screens/Profile", () => ({
  Profile: () => <div>Mock Profile</div>,
}))

test('renders navbar logo', () => {
   
    render(
        <MemoryRouter>
            <Navbar />
        </MemoryRouter>
    )

    expect(screen.getAllByText(/LUXE/i)[0]).toBeInTheDocument()
})

test("renders navigation links", () => {
  render(
    <MemoryRouter>
      <Navbar />
    </MemoryRouter>
  )

  expect(screen.getAllByText("Home")[0]).toBeInTheDocument()
  expect(screen.getAllByText("Shop")[0]).toBeInTheDocument()
  expect(screen.getAllByText("Categories")[0]).toBeInTheDocument()
  expect(screen.getAllByText("About")[0]).toBeInTheDocument()
})

test("search input appears when search icon clicked",async ()=>{
  render(
    <MemoryRouter>
        <Navbar />
    </MemoryRouter>
  )

  const searchBtn = screen.getByLabelText("search btn")
  await userEvent.click(searchBtn)

  const searchInput = screen.getByPlaceholderText(/Search products/i)
  expect(searchInput).toBeInTheDocument()
})

test("menu items appears when menu icon clicked",async ()=>{
  render(
    <MemoryRouter>
        <Navbar />
    </MemoryRouter>
  )

  const menuBtn = screen.getByLabelText("menu btn")
  await userEvent.click(menuBtn)

  const closeIcon = screen.getByLabelText("close icon")
  expect(closeIcon).toBeInTheDocument()
})
