import { act, render, screen } from "@testing-library/react";
import AuthFlow from "../auth-flow";

vi.mock("@/actions/auth/signIn");
vi.mock("@/actions/auth/signUp");

vi.mock("next/headers", () => ({
  headers: vi.fn(() => ({
    referer: "http://localhost:3000/",

    get() {
      return this.referer;
    },
  })),
}));

describe("AuthFlow", () => {
  ["signin", "signup"].forEach((mode) => {
    it(`should match the snapshot in ${mode} mode`, async () => {
      const searchParams = { mode };
      const { asFragment } = render(<AuthFlow searchParams={searchParams} />);
      await act(async () => {
        await vi.dynamicImportSettled();
      });

      expect(asFragment()).toMatchSnapshot();
    });
  });

  it("should render the signin form in signin mode", async () => {
    const searchParams = { mode: "signin" };
    render(<AuthFlow searchParams={searchParams} />);
    await act(async () => {
      await vi.dynamicImportSettled();
    });

    expect(screen.getByRole("form")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sign in" })).toBeInTheDocument();
    expect(screen.getByText("Don't have an account?")).toBeInTheDocument();
    expect(screen.getByText("Create an account")).toBeInTheDocument();
  });

  it("should render the google button in signin mode", () => {
    const searchParams = { mode: "signin" };
    render(<AuthFlow searchParams={searchParams} />);

    expect(screen.getByText("Continue with Google")).toBeInTheDocument();
  });

  it("should render the google button in signup mode", () => {
    const searchParams = { mode: "signup" };
    render(<AuthFlow searchParams={searchParams} />);

    expect(screen.getByText("Continue with Google")).toBeInTheDocument();
  });

  it("should render the signup form in signup mode", async () => {
    const searchParams = { mode: "signup" };
    render(<AuthFlow searchParams={searchParams} />);
    await act(async () => {
      await vi.dynamicImportSettled();
    });

    expect(screen.getByRole("form")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sign up" })).toBeInTheDocument();
    expect(screen.getByText("Already have an account?")).toBeInTheDocument();
    expect(screen.getByText("Sign in")).toBeInTheDocument();
  });
});
