import { userEventSetup } from "@/lib/utils/userEventSetup";
import { fireEvent, render, screen } from "@testing-library/react";
import { redirect } from "next/navigation";
import EmailVerificationForm from "../email-verification-form";

vi.mock("@/actions/auth/verifyEvc");
vi.mock("@/actions/auth/verifyEmail");
vi.mock("next/navigation", () => ({
  redirect: vi.fn((url: string) => {
    console.log("Redirecting to: ", url);
  }),
}));

// Mock the ResizeObserver
const ResizeObserverMock = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Stub the global ResizeObserver
vi.stubGlobal("ResizeObserver", ResizeObserverMock);

describe("EmailVerificationForm", () => {
  it("should match the snapshot", () => {
    const { asFragment } = render(<EmailVerificationForm email="" />);
    expect(asFragment()).toMatchSnapshot();
  });

  it("should render the form", () => {
    render(<EmailVerificationForm email="" />);
    expect(screen.getByRole("form")).toBeInTheDocument();
  });

  it("should render the buttons", () => {
    render(<EmailVerificationForm email="" />);
    expect(screen.getByRole("button", { name: "Verify" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Resend (60s)" })).toBeInTheDocument();
  });

  it("should render the error message for invalid input", async () => {
    const { user } = userEventSetup(<EmailVerificationForm email="" />);
    await user.click(screen.getByRole("button", { name: "Verify" }));
    expect(
      await screen.findByText("Your email verification code must be 6 alphanumeric characters.")
    ).toBeInTheDocument();
  });

  it("should render the error message for an incorrect email verification code", async () => {
    const { user } = userEventSetup(<EmailVerificationForm email="" />);
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "123455" } });
    await user.click(screen.getByRole("button", { name: "Verify" }));
    expect(await screen.findByText("Invalid email verification code.")).toBeInTheDocument();
  });

  it("should redirect if verification succeeds", async () => {
    const { user } = userEventSetup(<EmailVerificationForm email="" />);
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "123456" } });
    await user.click(screen.getByRole("button", { name: "Verify" }));
    expect(redirect).toHaveBeenCalledWith("/");
  });
});
