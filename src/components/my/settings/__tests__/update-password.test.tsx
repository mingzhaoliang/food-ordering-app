import UpdatePassword from "@/components/my/settings/update-password";
import { Toaster } from "@/components/ui/shadcn/toaster";
import { userEventSetup } from "@/lib/utils/userEventSetup";
import { act, render, screen } from "@testing-library/react";

vi.mock("@/actions/my/user.action");

describe("UpdatePassword", () => {
  it("should match the snapshot", () => {
    const component1 = render(<UpdatePassword hasCurrentPassword={true} />);
    const component2 = render(<UpdatePassword hasCurrentPassword={false} />);

    expect(component1).toMatchSnapshot();
    expect(component2).toMatchSnapshot();
  });

  [true, false].forEach((hasCurrentPassword) => {
    it(`should display action buttons if form is dirty - hasCurrentPassword=${hasCurrentPassword}`, async () => {
      const { user } = userEventSetup(<UpdatePassword hasCurrentPassword={hasCurrentPassword} />);
      await act(async () => {
        await vi.dynamicImportSettled();
      });

      await user.type(
        screen.getByPlaceholderText(hasCurrentPassword ? /current password/i : /^new password$/i),
        "test"
      );

      expect(await screen.findByRole("button", { name: /submit/i })).toBeInTheDocument();
      expect(await screen.findByRole("button", { name: /cancel/i })).toBeInTheDocument();
    });
  });

  it("should display error if values are invalid - hasCurrentPassword=true", async () => {
    const { user } = userEventSetup(<UpdatePassword hasCurrentPassword={true} />);

    await user.type(screen.getByPlaceholderText(/current password/i), "test");
    await user.click(screen.getByRole("button", { name: /submit/i }));

    expect(await screen.findAllByRole("alert")).toHaveLength(6);
  });

  it("should display error if values are invalid - hasCurrentPassword=false", async () => {
    const { user } = userEventSetup(<UpdatePassword hasCurrentPassword={false} />);

    await user.type(screen.getByPlaceholderText(/^new password$/i), "test");
    await user.click(screen.getByRole("button", { name: /submit/i }));

    expect(await screen.findAllByRole("alert")).toHaveLength(5);
  });

  it("should display error if current password is invalid - hasCurrentPassword=true", async () => {
    const { user } = userEventSetup(<UpdatePassword hasCurrentPassword={true} />);

    await user.type(screen.getByPlaceholderText(/current password/i), "test");
    await user.type(screen.getByPlaceholderText(/^new password$/i), "111111Aa.");
    await user.type(screen.getByPlaceholderText(/confirm new password/i), "111111Aa.");
    await user.click(screen.getByRole("button", { name: /submit/i }));

    expect(await screen.findAllByRole("alert")).toHaveLength(1);
  });

  it("should display error if current password and new password are the same", async () => {
    const { user } = userEventSetup(<UpdatePassword hasCurrentPassword={true} />);

    await user.type(screen.getByPlaceholderText(/current password/i), "111111Aa.");
    await user.type(screen.getByPlaceholderText(/^new password$/i), "111111Aa.");
    await user.type(screen.getByPlaceholderText(/confirm new password/i), "111111Aa.");
    await user.click(screen.getByRole("button", { name: /submit/i }));

    expect(await screen.findAllByRole("alert")).toHaveLength(1);
  });

  it("should display toast if update success - hasCurrentPassword=true", async () => {
    const { user } = userEventSetup(
      <div>
        <UpdatePassword hasCurrentPassword={true} />
        <Toaster />
      </div>
    );

    await user.type(screen.getByPlaceholderText(/current password/i), "123");
    await user.type(screen.getByPlaceholderText(/^new password$/i), "111111Aa.");
    await user.type(screen.getByPlaceholderText(/confirm new password/i), "111111Aa.");
    await user.click(screen.getByRole("button", { name: /submit/i }));

    expect(await screen.findByText(/password updated!/i)).toBeInTheDocument();
  });

  it("should display toast if update success - hasCurrentPassword=false", async () => {
    const { user } = userEventSetup(
      <div>
        <UpdatePassword hasCurrentPassword={false} />
        <Toaster />
      </div>
    );

    await user.type(screen.getByPlaceholderText(/^new password$/i), "111111Aa.");
    await user.type(screen.getByPlaceholderText(/confirm new password/i), "111111Aa.");
    await user.click(screen.getByRole("button", { name: /submit/i }));

    expect(await screen.findByText(/password updated!/i)).toBeInTheDocument();
  });
});
