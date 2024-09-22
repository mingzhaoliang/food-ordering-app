import { userEventSetup } from "@/lib/utils/userEventSetup";
import { act, render, screen } from "@testing-library/react";
import { redirect } from "next/navigation";
import SigninForm from "../signin-form";

vi.mock("@/actions/auth/signIn");
vi.mock("next/navigation", () => ({
  redirect: vi.fn((url: string) => {
    console.log("Redirecting to: ", url);
  }),
}));

describe("SigninForm", () => {
  it("should match the snapshot", () => {
    const { asFragment } = render(<SigninForm callbackUrl="/" />);
    expect(asFragment()).toMatchSnapshot();
  });

  it("should render the form", () => {
    render(<SigninForm callbackUrl="/" />);
    expect(screen.getByRole("form")).toBeInTheDocument();
  });

  it("should render the email input", async () => {
    render(<SigninForm callbackUrl="/" />);
    await act(async () => {
      await vi.dynamicImportSettled();
    });

    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
  });

  it("should render the password input", async () => {
    render(<SigninForm callbackUrl="/" />);
    await act(async () => {
      await vi.dynamicImportSettled();
    });
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
  });

  it("should render the submit button", () => {
    render(<SigninForm callbackUrl="/" />);
    expect(screen.getByRole("button", { name: "Sign in" })).toBeInTheDocument();
  });

  it("should show an error message if the email is not entered", async () => {
    const { user } = userEventSetup(<SigninForm callbackUrl="/" />);

    const submitButton = screen.getByRole("button", { name: "Sign in" });

    await user.click(submitButton);

    expect(await screen.findAllByRole("alert")).toHaveLength(1);
  });

  it("should show an error message if the password is not entered", async () => {
    const { user } = userEventSetup(<SigninForm callbackUrl="/" />);

    const emailInput = screen.getByPlaceholderText("Email");
    const submitButton = screen.getByRole("button", { name: "Sign in" });

    await user.type(emailInput, "invalid@email.com");
    await user.click(submitButton);

    expect(await screen.findAllByRole("alert")).toHaveLength(2);
  });

  it("should show an error message if neither password nor email is valid", async () => {
    const { user } = userEventSetup(<SigninForm callbackUrl="/" />);

    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText("Password");
    const submitButton = screen.getByRole("button", { name: "Sign in" });

    await user.type(emailInput, "invalid@email.com");
    await user.type(passwordInput, "invalid-password");
    await user.click(submitButton);

    expect(await screen.findAllByRole("alert")).toHaveLength(2);
  });

  it("should redirect to the callback URL if the email and password are valid", async () => {
    const { user } = userEventSetup(<SigninForm callbackUrl="/" />);

    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText("Password");
    const submitButton = screen.getByRole("button", { name: "Sign in" });

    await user.type(emailInput, "valid@email.com");
    await user.type(passwordInput, "valid-password");
    await user.click(submitButton);

    expect(screen.queryAllByRole("alert")).toHaveLength(0);
    expect(redirect).toHaveBeenCalledWith("/");
  });
});
