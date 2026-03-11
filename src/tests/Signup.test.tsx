import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import Signup from "../screens/auth/Signup"
import userEvent from "@testing-library/user-event"


test("renders signup form fields", ()=>{
    render(
        <MemoryRouter>
            <Signup />
        </MemoryRouter>
    )

    expect(screen.getByLabelText(/username/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument()
})

test("show validation errors when fields are empty",async ()=>{
     render(
        <MemoryRouter>
            <Signup />
        </MemoryRouter>
    )

    const button = screen.getByRole("button",{name:/sign up/i})

    await userEvent.click(button)

    expect(await screen.findByText(/please enter your username/i)).toBeInTheDocument()
    expect(await screen.findByText(/please enter your email/i)).toBeInTheDocument()
    expect(await screen.findByText(/please enter your password/i)).toBeInTheDocument()


})