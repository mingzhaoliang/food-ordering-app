import { Model, model, models, Schema, Types } from "mongoose";
import { ImageDoc, imageSchema } from "../cloudinary/image.model";

interface AddOnDoc {
  name: string;
  price: number;
}

const addOnSchema = new Schema<AddOnDoc>(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
  },
  { _id: false }
);

interface DishDoc {
  _id: string;
  name: string;
  slug: string;
  course: string;
  description: string;
  price: number;
  customisation: {
    addOns: Types.Array<AddOnDoc>;
    specialInstructions: boolean;
  };
  specialDiets: Types.Array<string>;
  onlineAvailable: boolean;
  image: ImageDoc;
  featured: boolean;
  popular: boolean;
  userId?: string;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

type DishModel = Model<DishDoc>;
type TDish = ReturnType<DishModel["hydrate"]>;

const dishSchema = new Schema<DishDoc>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true },
    course: { type: String, required: true },
    description: { type: String, required: false },
    price: { type: Number, required: true },
    customisation: {
      addOns: { type: [addOnSchema], default: [] },
      specialInstructions: { type: Boolean, default: true },
    },
    specialDiets: { type: [String], required: true },
    onlineAvailable: { type: Boolean, required: true },
    image: { type: imageSchema, required: true },
    featured: { type: Boolean, required: true, default: false },
    popular: { type: Boolean, required: true, default: false },
    userId: { type: String },
    expiresAt: { type: Date, default: undefined, expires: 0 },
  },
  { timestamps: true }
);

const Dish = (models.Dish as Model<DishDoc>) || model("Dish", dishSchema);

export { addOnSchema, Dish, type AddOnDoc, type DishDoc, type DishModel, type TDish };
