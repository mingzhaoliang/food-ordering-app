import { Model, model, models, Schema } from "mongoose";
import { ImageDoc, imageSchema } from "../cloudinary/image.model";

interface RestaurantDoc {
  _id: string;
  name: string;
  contactNumber: string;
  email: string;
  street: string;
  city: string;
  state: string;
  postcode: string;
  courses: CourseDoc[];
  specialDiets: SpecialDietDoc[];
  deliveryFee: number;
  freeDeliveryThreshold: number;
  estimatedDeliveryTime: number;
  createdAt: Date;
  updatedAt: Date;
}

interface CourseDoc {
  _id: string;
  name: string;
  slug: string;
  image: ImageDoc;
}

interface SpecialDietDoc {
  _id: string;
  name: string;
  slug: string;
  image: ImageDoc;
}

type RestaurantModel = Model<RestaurantDoc>;
type TRestaurant = ReturnType<RestaurantModel["hydrate"]>;

const courseSchema = new Schema<CourseDoc>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true },
    image: { type: imageSchema, required: true },
  },
  { timestamps: true }
);

const specialDietSchema = new Schema<SpecialDietDoc>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true },
    image: { type: imageSchema, required: true },
  },
  { timestamps: true }
);

const restaurantSchema = new Schema<RestaurantDoc>(
  {
    name: { type: String, required: true },
    contactNumber: { type: String, required: true },
    email: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postcode: { type: String, required: true },
    courses: {
      type: [courseSchema],
      default: [],
    },
    specialDiets: {
      type: [specialDietSchema],
      default: [],
    },
    deliveryFee: { type: Number, required: true },
    freeDeliveryThreshold: { type: Number, required: true },
    estimatedDeliveryTime: { type: Number, required: true },
  },
  { timestamps: true }
);

const Restaurant = (models.Restaurant as RestaurantModel) || model("Restaurant", restaurantSchema);
export { Restaurant, type CourseDoc, type RestaurantDoc, type RestaurantModel, type SpecialDietDoc, type TRestaurant };
