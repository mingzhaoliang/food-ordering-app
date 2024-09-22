import { userEventSetup } from "@/lib/utils/userEventSetup";
import { RestaurantDTO } from "@/services/mongoose/store/restaurant.dal";
import { act, render, screen } from "@testing-library/react";
import { Types } from "mongoose";
import ManageRestaurantForm from "../manage-restaurant-form";

vi.mock("@/actions/store/restaurant.action");
vi.mock("@/lib/hooks/useLocationSuggestions", () => ({
  useLocationSuggestions: vi.fn(() => ({
    suggestions: [],
  })),
}));

const mockRestaurant = {
  _id: new Types.ObjectId().toHexString(),
  name: "My restaurant",
  contactNumber: "+61423456789",
  email: "dummy@email.com",
  street: "123 Fake St",
  city: "Springfield",
  state: "QLD",
  postcode: "4000",
  courses: [
    {
      name: "Course 1",
      slug: "course-1",
      image: {
        publicId: "course1",
        type: "upload",
        resourceType: "image",
      },
    },
  ],
  specialDiets: [
    {
      name: "Vegetarian",
      slug: "vegetarian",
      image: {
        publicId: "vegetarian",
        type: "upload",
        resourceType: "image",
      },
    },
  ],
  createdAt: new Date(),
  updatedAt: new Date(),
} as RestaurantDTO;

describe("ManageRestaurantForm", () => {
  it("should match the snapshot", () => {
    const component = render(<ManageRestaurantForm restaurant={mockRestaurant} />);
    expect(component).toMatchSnapshot();
  });
});

describe("DetailsSection", () => {
  for (const field of ["name", "contactNumber", "email", "street", "city", "postcode"]) {
    it(`should show an error message if ${field} is empty`, async () => {
      const { user } = userEventSetup(<ManageRestaurantForm restaurant={mockRestaurant} />);
      await act(async () => {
        await vi.dynamicImportSettled();
      });

      await user.clear(screen.getByTestId(field));
      await user.click(await screen.findByRole("button", { name: /submit/i }));

      expect(await screen.findAllByTestId(`form-message-${field}`)).toHaveLength(1);
    });
  }

  it(`should show an error message if state is not selected`, async () => {
    const newMockRestaurant = {
      ...mockRestaurant,
      state: "",
    };

    const { user } = userEventSetup(<ManageRestaurantForm restaurant={newMockRestaurant} />);

    await user.type(screen.getByTestId("name"), "new name");
    await user.click(await screen.findByRole("button", { name: /submit/i }));

    expect(await screen.findAllByTestId("form-message-state")).toHaveLength(1);
  });
});
