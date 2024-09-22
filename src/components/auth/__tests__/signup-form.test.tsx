import { userEventSetup } from "@/lib/utils/userEventSetup";
import { act, render, screen } from "@testing-library/react";
import { redirect } from "next/navigation";
import SignupForm from "../signup-form";

vi.mock("@/actions/auth/signUp");
vi.mock("next/navigation", () => ({
  redirect: vi.fn((url: string) => {
    console.log("Redirecting to: ", url);
  }),
}));

describe("SignupForm", () => {
  it("should match the snapshot", () => {
    const { asFragment } = render(<SignupForm />);
    expect(asFragment()).toMatchSnapshot();
  });

  it("should render the form", () => {
    render(<SignupForm />);
    expect(screen.getByRole("form")).toBeInTheDocument();
  });

  it("should render the first name input", async () => {
    render(<SignupForm />);
    await act(async () => {
      await vi.dynamicImportSettled();
    });
    expect(screen.getByPlaceholderText("First name")).toBeInTheDocument();
  });

  it("should render the last name input", () => {
    render(<SignupForm />);
    expect(screen.getByPlaceholderText("Last name (optional)")).toBeInTheDocument();
  });

  it("should render the email input", () => {
    render(<SignupForm />);
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
  });

  it("should render the password input", () => {
    render(<SignupForm />);
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
  });

  it("should show error messages if the none of fields is entered", async () => {
    const { user } = userEventSetup(<SignupForm />);

    const submitButton = screen.getByRole("button", { name: "Sign up" });

    await user.click(submitButton);

    expect(await screen.findAllByRole("alert")).toHaveLength(7);
  });

  it("should show error messages if only first name is entered", async () => {
    const { user } = userEventSetup(<SignupForm />);

    const submitButton = screen.getByRole("button", { name: "Sign up" });

    await user.type(screen.getByPlaceholderText("First name"), "John");
    await user.click(submitButton);

    expect(await screen.findAllByRole("alert")).toHaveLength(6);
  });

  it("should show error messages if only last name is entered", async () => {
    const { user } = userEventSetup(<SignupForm />);

    const submitButton = screen.getByRole("button", { name: "Sign up" });

    await user.type(screen.getByPlaceholderText("Last name (optional)"), "Doe");
    await user.click(submitButton);

    expect(await screen.findAllByRole("alert")).toHaveLength(7);
  });

  it("should show error messages if only email is entered", async () => {
    const { user } = userEventSetup(<SignupForm />);

    const submitButton = screen.getByRole("button", { name: "Sign up" });

    await user.type(screen.getByPlaceholderText("Email"), "valid@email.com");
    await user.click(submitButton);

    expect(await screen.findAllByRole("alert")).toHaveLength(6);
  });

  it("should show error messages if only password is entered", async () => {
    const { user } = userEventSetup(<SignupForm />);

    const submitButton = screen.getByRole("button", { name: "Sign up" });

    await user.type(screen.getByPlaceholderText("Password"), "Valid123.");
    await user.click(submitButton);

    expect(await screen.findAllByRole("alert")).toHaveLength(2);
  });

  it("should show error messages if email is invalid", async () => {
    const { user } = userEventSetup(<SignupForm />);

    const submitButton = screen.getByRole("button", { name: "Sign up" });

    await user.type(screen.getByPlaceholderText("Email"), "invalid@email.e");
    await user.click(submitButton);

    expect(await screen.findByText("Please enter a valid email address.")).toBeInTheDocument();
  });

  it("should redirect to the email-verification page after successful signup", async () => {
    const { user } = userEventSetup(<SignupForm />);

    const firstNameInput = screen.getByPlaceholderText("First name");
    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText("Password");
    const submitButton = screen.getByRole("button", { name: "Sign up" });

    await user.type(firstNameInput, "John");
    await user.type(emailInput, "valid@email.com");
    await user.type(passwordInput, "Valid123.");
    await user.click(submitButton);

    expect(screen.queryAllByRole("alert")).toHaveLength(0);
    expect(redirect).toHaveBeenCalledWith("/auth/email-verification");
  });
});
