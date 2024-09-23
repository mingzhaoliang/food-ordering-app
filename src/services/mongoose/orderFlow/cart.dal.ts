import "server-only";

import { validateRequest } from "@/lib/lucia/auth";
import { Cart, CartDoc, TCart } from "@/schemas/mongoose/order/cart.model";
import { Dish, TDish } from "@/schemas/mongoose/store/dish.model";
import { Restaurant } from "@/schemas/mongoose/store/restaurant.model";
import { CartItemSchema } from "@/schemas/zod/orderFlow/cart-item.schema";
import { revalidateTag, unstable_cache } from "next/cache";
import { cookies } from "next/headers";
import dbConnect from "../mongoose";

interface CartDTO extends Omit<CartDoc, "_id" | "items"> {
  _id: string;
  items: {
    _id: string;
    dishId: string;
    quantity: number;
    addOns: { name: string; price: number }[];
    specialInstructions: string;
    price: number;
    total: number;
    name: string;
    slug: string;
    course: string;
    imageUrl: string;
  }[];
  totalQuantity: number;
  subtotal: number;
  deliveryFee: number;
  freeDeliveryThreshold: number;
}

const createCartDTO = (cart: TCart, dishes: TDish[], deliveryFee: number, freeDeliveryThreshold: number): CartDTO => {
  const cartObj = cart.toObject();
  const dishDetailsMap = dishes.reduce((acc, dish) => {
    acc[dish._id.toString()] = dish;
    return acc;
  }, {} as Record<string, TDish>);

  const cartItems = cartObj.items.map(({ _id, dishId, quantity, addOns, specialInstructions }) => {
    const { name, slug, course, image, price, customisation } = dishDetailsMap[dishId.toString()];
    const updatedAddOns = customisation.addOns.filter((addOn) => addOns.includes(addOn.name));
    const total = quantity * (price + updatedAddOns.reduce((acc, addOn) => acc + addOn.price, 0));

    return {
      _id: _id.toString(),
      dishId: dishId.toString(),
      quantity,
      addOns: updatedAddOns,
      specialInstructions,
      name,
      slug,
      course,
      imageUrl: image.imageUrl,
      price,
      total,
    };
  });

  const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cartItems.reduce((acc, item) => acc + item.total, 0);
  const currentDeliveryFee = freeDeliveryThreshold && subtotal >= freeDeliveryThreshold ? 0 : deliveryFee;

  const cartDTO = {
    ...cartObj,
    _id: cartObj._id.toString(),
    items: cartItems,
    deliveryFee: currentDeliveryFee,
    freeDeliveryThreshold,
    totalQuantity,
    subtotal,
  };

  return cartDTO;
};

const getCart = async () => {
  const { user } = await validateRequest();

  let userId = user?.id || cookies().get("guestSessionId")?.value;

  if (!userId) return null;

  return unstable_cache(
    async (): Promise<CartDTO> => {
      try {
        await dbConnect();
        let cart = await Cart.findOne({ userId }).exec();

        if (!cart) {
          cart = await Cart.create({ userId, expiresAt: user ? undefined : new Date(Date.now() + 1000 * 60 * 60 * 2) });
        }

        const dishes = await Dish.find({ _id: { $in: cart.items.map((item) => item.dishId) } });
        const { deliveryFee, freeDeliveryThreshold } = (await Restaurant.findOne().select(
          "deliveryFee freeDeliveryThreshold"
        ))!;

        return createCartDTO(cart, dishes, deliveryFee, freeDeliveryThreshold);
      } catch (error) {
        console.error(error);
        throw new Error("An error occurred. Please try again later.");
      }
    },
    ["cart", userId],
    { tags: ["cart"], revalidate: 60 * 30 }
  )();
};

const addCartItem = async (dishId: string, data: CartItemSchema) => {
  try {
    const { user } = await validateRequest();
    let userId = user?.id || cookies().get("guestSessionId")?.value;

    if (!userId) throw new Error("User not found.");

    await dbConnect();
    const dish = await Dish.findById(dishId);

    if (!dish) throw new Error("Dish not found");
    const { price, customisation } = dish;

    let cart = await Cart.findOne({ userId }).exec();

    if (!cart) {
      cart = new Cart({ userId, expiresAt: user ? undefined : new Date(Date.now() + 1000 * 60 * 60 * 2) });
    }

    const { quantity, addOns, specialInstructions } = data;

    const existingItem = cart.items.find(
      (item) =>
        item.dishId.toString() === dishId &&
        JSON.stringify(item.addOns) === JSON.stringify(addOns) && // Compare add-ons
        item.specialInstructions === specialInstructions // Compare special instructions
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({
        dishId,
        quantity: data.quantity,
        addOns: customisation.addOns.filter((addOn) => data.addOns.includes(addOn.name)),
        specialInstructions: data.specialInstructions,
        price,
      });
    }

    await cart.save();

    revalidateTag("cart");
  } catch (error) {
    console.error(error);
    throw new Error("An error occurred. Please try again later.");
  }
};

const updateCartItem = async (cartItemId: string, quantity: number) => {
  try {
    const { user } = await validateRequest();

    let userId = user?.id || cookies().get("guestSessionId")?.value;

    if (!userId) throw new Error("User not found.");

    await dbConnect();

    const cart = await Cart.findOne({ userId }).exec();
    if (!cart) throw new Error("Cart not found");

    const item = cart.items.find((item) => item._id.toString() === cartItemId);
    if (!item) throw new Error("Item not found");

    item.quantity = quantity;

    await cart.save();

    revalidateTag("cart");
  } catch (error) {
    console.error(error);
    throw new Error("An error occurred. Please try again later.");
  }
};

const deleteCartItem = async (cartItemId: string) => {
  try {
    const { user } = await validateRequest();

    let userId = user?.id || cookies().get("guestSessionId")?.value;

    if (!userId) throw new Error("User not found");

    await dbConnect();

    const cart = await Cart.findOne({ userId }).exec();

    if (!cart) throw new Error("Cart not found");

    const removedItem = cart.items.find((item) => item._id.toString() === cartItemId);

    cart.items.pull(removedItem);

    await cart.save();

    revalidateTag("cart");
  } catch (error) {
    console.error(error);
    throw new Error("An error occurred. Please try again later.");
  }
};

export { addCartItem, createCartDTO, deleteCartItem, getCart, updateCartItem, type CartDTO };
