import { Model, model, models, Schema, Types } from "mongoose";

interface CartItemDoc {
  _id: string;
  dishId: string | Types.ObjectId;
  quantity: number;
  addOns: string[];
  specialInstructions: string;
}

interface CartDoc {
  _id: string;
  userId: string;
  items: Types.Array<CartItemDoc>;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const cartItemSchema = new Schema<CartItemDoc>({
  dishId: { type: Schema.Types.ObjectId, ref: "Dish", required: true },
  quantity: { type: Number, required: true, min: 1 },
  addOns: { type: [String], default: [] },
  specialInstructions: { type: String, default: "" },
});

const cartSchema = new Schema<CartDoc>(
  {
    userId: { type: String, ref: "User", required: true, unique: true },
    items: { type: [cartItemSchema], required: true, default: [] },
    expiresAt: { type: Date, expires: 0 },
  },
  { timestamps: true }
);

type CartModel = Model<CartDoc>;
type TCart = ReturnType<CartModel["hydrate"]>;
type TCartItem = ReturnType<Model<CartItemDoc>["hydrate"]>;

const Cart = (models.Cart as CartModel) || model("Cart", cartSchema);

export { Cart, type CartDoc, type CartItemDoc, type CartModel, type TCart, type TCartItem };
