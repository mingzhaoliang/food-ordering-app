import "server-only";

import { validateRequest } from "@/lib/lucia/auth";
import {
  DeliveryStatusEnum,
  Order,
  OrderDoc,
  OrderItemDoc,
  OrderStatusEnum,
  TOrder,
} from "@/schemas/mongoose/order/order.model";
import { Dish, TDish } from "@/schemas/mongoose/store/dish.model";
import { Restaurant } from "@/schemas/mongoose/store/restaurant.model";
import { revalidatePath } from "next/cache";
import dbConnect from "../mongoose";

const PAGE_LIMIT = 10;

interface OrderOverviewDTO {
  _id: string;
  items: {
    dishId: string;
    name: string;
    imageUrl: string;
  }[];
  total: number;
  isPaid: boolean;
  orderStatus: OrderStatusEnum;
  deliveryStatus: DeliveryStatusEnum;
  expiresAt: Date;
}

interface OrderDTO extends Omit<OrderDoc, "_id" | "items"> {
  _id: string;
  items: (Omit<OrderItemDoc, "dishId"> & { dishId: string })[];
}

const buildDishDetailsMap = <T extends (keyof TDish)[]>(dishes: TDish[], fields: T) => {
  return dishes.reduce((acc, dish) => {
    acc[dish._id.toString()] = fields.reduce((obj, field) => {
      obj[field] = dish[field];
      return obj;
    }, {} as Record<string, any>);
    return acc;
  }, {} as Record<string, Record<T[number], any>>);
};

// Create OrderOverviewDTO
const createOrderOverviewDTO = (order: TOrder, dishes: TDish[]): OrderOverviewDTO => {
  const dishDetailsMap = buildDishDetailsMap(dishes, ["name", "image"]);

  const orderOverviewDTO = {
    _id: order._id.toString(),
    items: order.items.map((item) => ({
      dishId: item.dishId.toString(),
      name: dishDetailsMap[item.dishId.toString()].name,
      imageUrl: dishDetailsMap[item.dishId.toString()].image.imageUrl,
    })),
    total: order.total,
    isPaid: order.isPaid,
    orderStatus: order.orderStatus,
    deliveryStatus: order.deliveryInfo.status,
    expiresAt: order.expiresAt,
  };

  return orderOverviewDTO;
};

// Create OrderDTO
const createOrderDTO = (order: TOrder): OrderDTO => {
  const orderObj = order.toObject();

  const orderDTO = {
    ...orderObj,
    _id: orderObj._id.toString(),
    items: orderObj.items.map((item) => ({
      ...item,
      _id: item._id.toString(),
      dishId: item.dishId.toString(),
    })),
  };

  return orderDTO;
};

interface GetOrdersArg {
  page?: number;
  limit?: number;
}

interface GetOrdersResponse {
  orders: OrderOverviewDTO[];
  totalPages: number;
  currentPage: number;
}

const getOrders = async ({ page = 1, limit = PAGE_LIMIT }: GetOrdersArg): Promise<GetOrdersResponse> => {
  try {
    const { user } = await validateRequest();
    if (!user) throw new Error("unauthenticated");

    await dbConnect();

    // Pagination options
    const filter = { userId: user.id };
    const options = { limit, skip: (page - 1) * limit, sort: "-createdAt" };

    // Get total number of documents for pagination
    const totalOrders = await Order.countDocuments(filter).exec();

    const totalPages = Math.ceil(totalOrders / limit);

    // Handle the case where the requested page is greater than the total number of pages
    if (page > totalPages) return { orders: [], totalPages, currentPage: totalPages };

    const orders = await Order.find(filter, {}, options).exec();

    const dishes = await Dish.find({
      _id: { $in: orders.flatMap((order) => order.items.map((item) => item.dishId)) },
    }).exec();

    const ordersDTO = orders.map((order) => createOrderOverviewDTO(order, dishes));

    return { orders: ordersDTO, totalPages, currentPage: page };
  } catch (error) {
    console.error(error);
    throw new Error("Failed to get orders");
  }
};

interface GetStoreOrdersArg extends GetOrdersArg {
  orderStatus?: OrderStatusEnum;
  deliveryStatus?: DeliveryStatusEnum;
  createdAt?: Date;
  page?: number;
  limit?: number;
}

const getStoreOrders = async ({
  orderStatus,
  deliveryStatus,
  createdAt,
  page = 1,
  limit = PAGE_LIMIT,
}: GetStoreOrdersArg): Promise<GetOrdersResponse> => {
  try {
    const { user } = await validateRequest();
    if (!user || !["admin", "superadmin"].includes(user.role)) throw new Error("Unauthorised!");

    await dbConnect();

    // Pagination options
    const filter: Record<string, any> = {};

    if (deliveryStatus) {
      filter["deliveryInfo.status"] = deliveryStatus;
    }

    if (orderStatus) {
      filter.orderStatus = orderStatus;
    }

    if (createdAt) {
      filter.createdAt = {
        $gte: new Date(createdAt.setHours(0, 0, 0, 0)),
        $lte: new Date(createdAt.setHours(23, 59, 59, 999)),
      };
    }

    const options = { limit, skip: (page - 1) * limit, sort: "-createdAt" };

    // Get total number of documents for pagination
    const totalOrders = await Order.countDocuments(filter).exec();

    const totalPages = Math.ceil(totalOrders / limit);

    // Handle the case where the requested page is greater than the total number of pages
    if (page > totalPages) return { orders: [], totalPages, currentPage: totalPages };

    const orders = await Order.find(filter, {}, options).exec();

    const dishes = await Dish.find({
      _id: { $in: orders.flatMap((order) => order.items.map((item) => item.dishId)) },
    }).exec();

    const ordersDTO = orders.map((order) => createOrderOverviewDTO(order, dishes));

    return { orders: ordersDTO, totalPages, currentPage: page };
  } catch (error) {
    console.error(error);
    throw new Error("Failed to get orders");
  }
};

const getOrder = async (orderId?: string, trackingToken?: string): Promise<OrderDTO> => {
  try {
    const { user } = await validateRequest();

    if (!user && !trackingToken) throw new Error("Unauthorised");

    await dbConnect();
    const filter = user ? { _id: orderId } : { _id: orderId, trackingToken };
    const order = await Order.findOne(filter).exec();

    if (!order) throw new Error("Order not found");

    return createOrderDTO(order);
  } catch (error) {
    console.error(error);
    throw new Error("Failed to get order");
  }
};

const updateDeliveryStatus = async (orderId: string, deliveryStatus: string) => {
  try {
    const { user } = await validateRequest();
    if (!user || !["admin", "superadmin"].includes(user.role)) throw new Error("Unauthorised");

    await dbConnect();

    const order = await Order.findById(orderId).exec();

    if (!order) throw new Error("Order not found");

    let expectedDeliveryTime: Date | undefined;
    let actualDeliveryTime: Date | undefined;

    if (order.deliveryInfo.status === "pending" && deliveryStatus === "preparing") {
      const restaurant = await Restaurant.findOne().exec();
      if (!restaurant) throw new Error("Restaurant not found");
      const { estimatedDeliveryTime } = restaurant;

      expectedDeliveryTime = estimatedDeliveryTime
        ? new Date(Date.now() + estimatedDeliveryTime * 60 * 1000)
        : undefined;
    } else if (deliveryStatus === "delivered") {
      actualDeliveryTime = new Date();
    }

    await Order.updateOne(
      { _id: orderId },
      {
        "deliveryInfo.status": deliveryStatus,
        ...(expectedDeliveryTime ? { "deliveryInfo.expectedDeliveryTime": expectedDeliveryTime } : {}),
        ...(actualDeliveryTime ? { "deliveryInfo.actualDeliveryTime": actualDeliveryTime } : {}),
      }
    ).exec();

    revalidatePath("/store/orders", "layout");
  } catch (error) {
    console.error(error);
    throw new Error("Failed to update order");
  }
};

const cancelOrder = async (orderId: string) => {
  try {
    const { user } = await validateRequest();
    if (!user) throw new Error("Unauthorised!");

    await dbConnect();
    await Order.updateOne({ _id: orderId }, { orderStatus: "cancelled", "deliveryInfo.status": "cancelled" }).exec();

    revalidatePath("/my/orders", "layout");
    revalidatePath("/store/orders", "layout");
  } catch (error) {
    console.error(error);
    throw new Error("Failed to cancel order");
  }
};

export { cancelOrder, getOrder, getOrders, getStoreOrders, updateDeliveryStatus, type OrderDTO, type OrderOverviewDTO };
