"use server";

import { validateRequest } from "@/lib/lucia/auth";
import { deliveryStatusEnum, DeliveryStatusEnum } from "@/schemas/mongoose/order/order.model";
import { cancelOrder, updateDeliveryStatus } from "@/services/mongoose/store/order.dal";
import { redirect } from "next/navigation";
import { z } from "zod";

const schema = z.object({
  status: z.enum(deliveryStatusEnum),
});

const cancelOrderAction = async (orderId: string) => {
  try {
    const { user } = await validateRequest();
    if (!user) redirect("/auth");

    await cancelOrder(orderId);
  } catch (error) {
    console.error(error);
    throw new Error("Failed to cancel order");
  }
};

const updateDeliveryStatusAction = async (orderId: string, status: DeliveryStatusEnum) => {
  try {
    const { user } = await validateRequest();

    if (!user) redirect("/auth");
    if (!["admin", "superadmin"].includes(user.role)) return { message: "Unauthorised!" };

    const validatedData = schema.safeParse({ status });
    if (!validatedData.success) throw new Error("Invalid data");

    await updateDeliveryStatus(orderId, validatedData.data.status);
  } catch (error) {
    console.error(error);
    throw new Error("Failed to update delivery status");
  }
};

export { cancelOrderAction, updateDeliveryStatusAction };
