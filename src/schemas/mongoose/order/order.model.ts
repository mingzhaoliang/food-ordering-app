import { Model, model, models, Schema, Types } from "mongoose";

const deliveryStatusEnum = ["pending", "preparing", "out-for-delivery", "delivered", "cancelled"] as const;
const orderStatusEnum = ["unpaid", "paid", "cancelled", "failed"] as const;

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

interface DeliveryInfo {
  status: DeliveryStatusEnum;
  expectedDeliveryTime?: Date;
  actualDeliveryTime?: Date;
  deliveryPerson: {
    name: string;
    phoneNumber: string;
  };
}

interface DeliveryAddress {
  street: string;
  city: string;
  state: string;
  postcode: string;
  instructions?: string;
}

interface OrderItemDoc {
  _id: string;
  dishId: string | Types.ObjectId;
  name: string;
  course: string;
  addOns: Types.Array<AddOnDoc>;
  specialInstructions: string;
  quantity: number;
  price: number;
  total: number;
  imageUrl?: string;
}

interface OrderDoc {
  _id: string | Types.ObjectId;
  userId: string;
  items: Types.Array<OrderItemDoc>;
  subtotal: number;
  deliveryFee: number;
  total: number;
  isPaid: boolean;
  paymentMethod?: string;
  paymentResult?: {
    id: string;
    status: string;
    receiptUrl: string;
    paidAt?: Date;
  };
  orderStatus: OrderStatusEnum;
  deliveryInfo: DeliveryInfo;
  deliveryAddress: DeliveryAddress;
  trackingToken?: string;
  createdAt: Date;
  updatedAt: Date;
  expiresAt: Date;
}

const orderItemSchema = new Schema<OrderItemDoc>({
  dishId: { type: Schema.Types.ObjectId, ref: "Dish", required: true },
  name: { type: String, required: true },
  course: { type: String, required: true },
  addOns: { type: [addOnSchema], default: [] },
  specialInstructions: { type: String, default: "" },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  total: {
    type: Number,
    required: true,
    default: function () {
      return this.price * this.quantity;
    },
  },
  imageUrl: { type: String },
});

const orderSchema = new Schema<OrderDoc>(
  {
    _id: { type: Schema.Types.ObjectId, required: true },
    userId: { type: String, ref: "User", required: true },
    items: [orderItemSchema],
    subtotal: { type: Number, required: true },
    deliveryFee: { type: Number, required: true },
    total: { type: Number, required: true },
    isPaid: { type: Boolean, default: false },
    paymentMethod: { type: String },
    paymentResult: {
      id: { type: String },
      status: { type: String },
      receiptUrl: { type: String },
      paidAt: { type: Date },
    },
    orderStatus: {
      type: String,
      enum: orderStatusEnum,
      default: "unpaid",
      required: true,
    },
    deliveryInfo: {
      status: { type: String, enum: deliveryStatusEnum, default: "pending", required: true },
      expectedDeliveryTime: { type: Date },
      actualDeliveryTime: { type: Date },
      deliveryPerson: {
        name: { type: String, required: true },
        phoneNumber: { type: String, required: true },
      },
    },
    deliveryAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postcode: { type: String, required: true },
    },
    trackingToken: { type: String },
    expiresAt: { type: Date, required: true },
  },
  { _id: false, timestamps: true }
);

orderSchema.pre(["find", "findOne"], async function (next) {
  const now = new Date();
  const filter = this.getFilter();

  // Automatically cancel expired orders in the query
  await this.model.updateMany(
    {
      ...filter,
      isPaid: false,
      expiresAt: { $lt: now },
      orderStatus: { $ne: "cancelled" },
    },
    {
      $set: { orderStatus: "cancelled", "deliveryInfo.status": "cancelled" },
    }
  );

  next();
});

type OrderModel = Model<OrderDoc>;
type TOrder = ReturnType<OrderModel["hydrate"]>;
type TOrderItem = ReturnType<Model<OrderItemDoc>["hydrate"]>;

type OrderStatusEnum = (typeof orderStatusEnum)[number];
type DeliveryStatusEnum = (typeof deliveryStatusEnum)[number];

const Order = (models.Order as OrderModel) || model("Order", orderSchema);

export {
  deliveryStatusEnum,
  Order,
  orderStatusEnum,
  type DeliveryAddress,
  type DeliveryInfo,
  type DeliveryStatusEnum,
  type OrderDoc,
  type OrderItemDoc,
  type OrderModel,
  type OrderStatusEnum,
  type TOrder,
  type TOrderItem,
};
