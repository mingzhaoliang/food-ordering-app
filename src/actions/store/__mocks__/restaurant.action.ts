"use server";

import { RestaurantSchema, restaurantSchema } from "@/schemas/zod/store/restaurant.schema";
import { ActionState } from "@/types/ActionState";

const updateRestaurantAction = async (prevState: ActionState<RestaurantSchema>, formData: FormData) => {
  const data = Object.fromEntries(formData) as Record<string, string | File | object>;

  const courses: {
    name?: string;
    image: {
      publicId: string;
      type: string;
      resourceType: string;
    };
    imageFile?: File;
  }[] = [];

  for (const key in data) {
    if (key.startsWith("courses.")) {
      // Extract the course index and the field name (e.g., "0" and "name")
      const match = key.match(/^courses\.(\d+)\.(\w+)$/);
      if (match) {
        const index = Number(match[1]);
        const field = match[2] as "name" | "image" | "imageFile";

        // Ensure the course array has enough slots
        courses[index] = courses[index] || {};

        // Assign the field value to the corresponding course object
        courses[index][field] = field === "image" ? JSON.parse(data[key] as string) : data[key];
      }

      // Remove the original flattened key from the transformed data
      delete data[key];
    }
  }

  data.courses = courses;

  const validatedFields = restaurantSchema.safeParse(data);

  if (!validatedFields.success) {
    const errors = {
      ...validatedFields.error.flatten().fieldErrors,
      courses: validatedFields.error.errors
        .filter((error) => error.path.includes("courses"))
        .reduce((acc, error) => {
          const index = Number(error.path[1]);
          acc[index] = acc[index] || {};
          acc[index][error.path[2]] = [error.message];
          return acc;
        }, [] as Array<Record<string, string[]>>),
    };
    return Promise.resolve({ errors });
  }

  return Promise.resolve({ message: "success" });
};

export { updateRestaurantAction };
