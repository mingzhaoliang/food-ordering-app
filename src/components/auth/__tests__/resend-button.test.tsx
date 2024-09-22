import * as verifyEmail from "@/actions/auth/verifyEmail";
import { Toaster } from "@/components/ui/shadcn/toaster";
import * as useCountDown from "@/lib/hooks/useCountDown";
import { userEventSetup } from "@/lib/utils/userEventSetup";
import { act, render, screen } from "@testing-library/react";
import ResendButton from "../resend-button";

vi.mock("@/actions/auth/verifyEmailVerificationCode");
vi.mock("@/actions/auth/verifyEmail");

describe("ResendButton", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should disable resend button for 60 seconds", async () => {
    render(<ResendButton />);
    expect(screen.getByRole("button", { name: /\bResend\b/ })).toBeDisabled();

    act(() => {
      vi.advanceTimersByTime(30000);
    });

    expect(screen.getByRole("button", { name: /\bResend\b/ })).toBeDisabled();
  });

  it("should enable resend button after 60 seconds", async () => {
    render(<ResendButton />);

    act(() => {
      vi.advanceTimersByTime(60000);
    });

    expect(screen.getByRole("button", { name: /\bResend\b/ })).toBeEnabled();
  });

  it("should display success toast if code is resent", async () => {
    vi.useRealTimers();
    vi.spyOn(useCountDown, "useCountDown").mockReturnValue({
      countDown: 0,
      resetCountDown: vi.fn(),
    });

    const { user } = userEventSetup(
      <div>
        <ResendButton />
        <Toaster />
      </div>
    );

    await user.click(screen.getByRole("button", { name: /\bResend\b/ }));
    expect(await screen.findByText("Verification code sent.")).toBeInTheDocument();
  });

  it("should display error toast if code is not resent", async () => {
    vi.useRealTimers();
    vi.spyOn(useCountDown, "useCountDown").mockReturnValue({
      countDown: 0,
      resetCountDown: vi.fn(),
    });

    vi.spyOn(verifyEmail, "verifyEmail").mockResolvedValue({
      message: "An error occurred. Please try again.",
    });

    const { user } = userEventSetup(
      <div>
        <ResendButton />
        <Toaster />
      </div>
    );

    await user.click(screen.getByRole("button", { name: /\bResend\b/ }));
    expect(await screen.findByText("Something went wrong.")).toBeInTheDocument();
  });
});
