"use server";

import { validateRequest } from "@/lib/lucia/auth";
import { Cart } from "@/schemas/mongoose/order/cart.model";
import { Order, OrderItemDoc } from "@/schemas/mongoose/order/order.model";
import { Dish, TDish } from "@/schemas/mongoose/store/dish.model";
import { CheckoutDetailsSchema } from "@/schemas/zod/orderFlow/checkout-details.schema";
import { stripe, Stripe } from "@/services/api/stripe";
import { getRestaurant } from "@/services/mongoose/store/restaurant.dal";
import crypto from "crypto";
import { Types } from "mongoose";
import { cookies } from "next/headers";

const orderExpirationTime = 60 * 60; // 1 hour
const overdueTime = 60 * 30; // 30 minutes

interface CheckoutSessionArgs {
  deliveryDetails?: CheckoutDetailsSchema;
  orderId?: string;
}

const createCheckoutSession = async ({ deliveryDetails, orderId: existingOrderId }: CheckoutSessionArgs) => {
  try {
    const { user } = await validateRequest();
    let userId = user?.id || cookies().get("guestSessionId")?.value;
    if (!userId) throw new Error("User not found.");

    // Get the order details
    const { orderId, items, deliveryFee } = await createOrderDetails(userId, existingOrderId);
    const trackingToken = user ? undefined : crypto.randomBytes(16).toString("hex");

    // Create a new order if it doesn't exist
    if (!existingOrderId) {
      if (!deliveryDetails) {
        throw new Error("Delivery details are required");
      }
      await createNewOrder({ orderId, userId, items, deliveryFee, deliveryDetails, trackingToken });
    }

    // Get the dishes
    const dishes = await Dish.find().exec();

    // Create line items for the checkout session
    const lineItems = createLineItems(items, dishes);

    const successUrl =
      process.env.BASE_URL + "/my/orders/" + orderId.toHexString() + (trackingToken && "?token=" + trackingToken);
    const cancelUrl = process.env.BASE_URL + (user ? "/my/orders" : "/");

    // Create a new checkout session
    const stripSession = await createStripeSession(
      deliveryDetails?.email ?? user?.email,
      lineItems,
      orderId,
      deliveryFee,
      successUrl,
      cancelUrl
    );

    if (!stripSession.url) {
      throw new Error("Failed to create a checkout session");
    }

    return { url: stripSession.url };
  } catch (error: any) {
    console.error(error);
    throw new Error(error.message);
  }
};

const createNewOrder = async ({
  orderId,
  userId,
  items,
  deliveryFee,
  deliveryDetails,
  trackingToken,
}: {
  orderId: Types.ObjectId;
  userId: string;
  items: OrderItemDoc[];
  deliveryFee: number;
  deliveryDetails: CheckoutDetailsSchema;
  trackingToken?: string;
}) => {
  const subtotal = items.reduce((acc, item) => acc + item.total, 0);
  const total = subtotal + deliveryFee;

  const newOrder = {
    _id: orderId,
    userId,
    items,
    deliveryInfo: { deliveryPerson: { name: deliveryDetails.name, phoneNumber: deliveryDetails.phoneNumber } },
    deliveryAddress: { ...deliveryDetails },
    subtotal,
    deliveryFee,
    total,
    expiresAt: new Date(Date.now() + orderExpirationTime * 1000 + overdueTime * 1000),
    trackingToken,
  };

  await Order.create(newOrder);

  const orderItemIds = items.map((item) => item.dishId);
  await Cart.updateOne(
    { userId },
    {
      $pull: {
        items: {
          dishId: { $in: orderItemIds },
        },
      },
    }
  );
};

const createOrderDetails = async (userId: string, existingOrderId: string | undefined) => {
  let orderId = existingOrderId ? new Types.ObjectId(existingOrderId) : undefined;
  let items: OrderItemDoc[], deliveryFee: number;

  if (orderId) {
    const order = await Order.findById(orderId);

    if (!order) {
      throw new Error("Order not found");
    }

    items = order.items;
    deliveryFee = order.deliveryFee;
  } else {
    orderId = new Types.ObjectId();
    const cart = await Cart.findOne({ userId });
    if (!cart) throw new Error("Cart not found");

    const { deliveryFee: storeDeliveryFee, freeDeliveryThreshold } = await getRestaurant();
    const dishes = await Dish.find({ _id: { $in: cart.items.map((item) => item.dishId) } });

    const cartObj = cart.toObject();
    const dishDetailsMap = dishes.reduce((acc, dish) => {
      acc[dish._id.toString()] = dish;
      return acc;
    }, {} as Record<string, TDish>);

    items = cartObj.items.map(({ _id, dishId, quantity, addOns, specialInstructions }) => {
      const { name, course, image, price, customisation } = dishDetailsMap[dishId.toString()];
      const updatedAddOns = customisation.addOns.filter((addOn) => addOns.includes(addOn.name));
      const total = quantity * (price + updatedAddOns.reduce((acc, addOn) => acc + addOn.price, 0));

      return {
        _id: _id.toString(),
        dishId,
        quantity,
        addOns: updatedAddOns as any,
        specialInstructions,
        name,
        course,
        imageUrl: image.imageUrl,
        price,
        total,
      };
    });

    const subtotal = items.reduce((acc, item) => acc + item.total, 0);
    deliveryFee = freeDeliveryThreshold && subtotal >= freeDeliveryThreshold ? 0 : storeDeliveryFee;
  }

  return { orderId, items, deliveryFee };
};

const createLineItems = (items: OrderItemDoc[], dishes: TDish[]) => {
  const dishNames = new Map(dishes.map((dish) => [dish._id.toString(), dish.name]));

  const lineItems = items.map((item) => {
    const dishName = dishNames.get(item.dishId.toString());
    if (!dishName) {
      throw new Error("Dish not found");
    }

    const lineItem: Stripe.Checkout.SessionCreateParams.LineItem = {
      price_data: {
        currency: "AUD",
        unit_amount: item.price * 100,
        product_data: {
          name: dishName,
        },
      },
      quantity: item.quantity,
    };

    return lineItem;
  });

  return lineItems;
};

const createStripeSession = async (
  userEmail: string | undefined,
  lineItems: Stripe.Checkout.SessionCreateParams.LineItem[],
  orderId: Types.ObjectId,
  deliveryFee: number,
  successUrl: string,
  cancelUrl: string
) => {
  const sessionData = stripe.checkout.sessions.create({
    line_items: lineItems,
    shipping_options: [
      {
        shipping_rate_data: {
          display_name: "Delivery",
          type: "fixed_amount",
          fixed_amount: {
            amount: deliveryFee * 100,
            currency: "AUD",
          },
        },
      },
    ],
    mode: "payment",
    metadata: {
      orderId: orderId.toHexString(),
    },
    success_url: successUrl,
    cancel_url: cancelUrl,
    expires_at: Math.floor(Date.now() / 1000) + overdueTime, // orderExpirationTime,
    payment_intent_data: {
      receipt_email: userEmail,
      metadata: {
        orderId: orderId.toHexString(),
      },
    },
  });

  return sessionData;
};

export default createCheckoutSession;
