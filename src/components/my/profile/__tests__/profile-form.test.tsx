import { userEventSetup } from "@/lib/utils/userEventSetup";
import { act, render, screen } from "@testing-library/react";
import { Types } from "mongoose";
import ProfileForm from "../profile-form";

vi.mock("@/actions/my/profile.action");
vi.mock("@/lib/hooks/useLocationSuggestions", () => ({
  useLocationSuggestions: vi.fn(() => ({
    suggestions: [],
  })),
}));

describe("ProfileForm", () => {
  const mockProfile = {
    _id: new Types.ObjectId().toString(),
    userId: "123",
    firstName: "John",
    lastName: "Doe",
    fullName: "John Doe",
    phoneNumber: "+61423456789",
    street: "123 Main St",
    city: "AnyTown",
    state: "NSW" as const,
    postcode: "1234",
    avatar: {
      publicId: "123",
      type: "upload",
      resourceType: "image",
      version: "123",
      imageUrl: "https://example.com/image.jpg",
    } as any,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  it("should match the snapshot", () => {
    const component = render(<ProfileForm profile={mockProfile} />);
    expect(component).toMatchSnapshot();
  });

  it("should display profile information", async () => {
    render(<ProfileForm profile={mockProfile} />);
    await act(async () => {
      await vi.dynamicImportSettled();
    });

    expect(screen.getByDisplayValue(mockProfile.firstName)).toBeInTheDocument();
    expect(screen.getByDisplayValue(mockProfile.lastName)).toBeInTheDocument();
    expect(screen.getByDisplayValue("+61 423 456 789")).toBeInTheDocument();
    expect(screen.getByDisplayValue(mockProfile.street)).toBeInTheDocument();
    expect(screen.getByDisplayValue(mockProfile.city)).toBeInTheDocument();
    expect(screen.getByDisplayValue(mockProfile.state)).toBeInTheDocument();
    expect(screen.getByDisplayValue(mockProfile.postcode)).toBeInTheDocument();
  });

  it("should hide action buttons when form is not dirty", () => {
    render(<ProfileForm profile={mockProfile} />);

    expect(screen.queryByRole("button", { name: /cancel/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /submit/i })).not.toBeInTheDocument();
  });

  it("should display action buttons when form is dirty", async () => {
    const { user } = userEventSetup(<ProfileForm profile={mockProfile} />);

    await user.type(screen.getByTestId("firstName"), "Joe");

    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /submit/i })).toBeInTheDocument();
  });

  it("should show an error message if first name is less than 2 characters", async () => {
    const { user } = userEventSetup(<ProfileForm profile={mockProfile} />);

    await user.clear(screen.getByTestId("firstName"));
    await user.click(screen.getByRole("button", { name: /submit/i }));

    expect(await screen.findByText(/please enter at least 2 characters/i)).toBeInTheDocument();
  });

  it("should show an error message if last name is less than 2 characters", async () => {
    const { user } = userEventSetup(<ProfileForm profile={mockProfile} />);

    await user.clear(screen.getByTestId("lastName"));
    await user.type(screen.getByTestId("lastName"), "d");
    await user.click(screen.getByRole("button", { name: /submit/i }));

    expect(await screen.findByText(/please enter at least 2 characters/i)).toBeInTheDocument();
  });

  it("should show an error message if phone number is invalid", async () => {
    mockProfile.phoneNumber = "";
    const { user } = userEventSetup(<ProfileForm profile={mockProfile} />);

    await user.type(screen.getByTestId("phoneNumber"), "123");
    await user.click(screen.getByRole("button", { name: /submit/i }));

    expect(
      await screen.findByText(/please enter a valid phone number \(include the international prefix\)/i)
    ).toBeInTheDocument();
  });

  for (const field of ["street", "city", "postcode"]) {
    it(`should show an error message if only ${field} is entered`, async () => {
      const newMockUser = {
        ...mockProfile,
        street: "",
        city: "",
        state: "" as any,
        postcode: "",
      };
      const { user } = userEventSetup(<ProfileForm profile={newMockUser} />);

      await user.type(screen.getByTestId(field), `1234`);
      await user.click(screen.getByRole("button", { name: /submit/i }));

      expect(await screen.findAllByText(/\w+ must not be empty/i)).toHaveLength(3);
    });
  }

  it(`should show an error message if only state is selected`, async () => {
    window.HTMLElement.prototype.scrollIntoView = vi.fn();
    window.HTMLElement.prototype.hasPointerCapture = vi.fn();

    const newMockUser = {
      ...mockProfile,
      street: "",
      city: "",
      state: "" as any,
      postcode: "",
    };
    const { user } = userEventSetup(<ProfileForm profile={newMockUser} />);

    const selectElementTrigger = await screen.findByTestId("state");
    await user.click(selectElementTrigger);

    const selectedOption = await screen.findByRole("option", { name: "ACT" });
    await user.click(selectedOption);
    await user.click(screen.getByRole("button", { name: /submit/i }));

    expect(await screen.findAllByText(/\w+ must not be empty/i)).toHaveLength(3);
  });
});
