import { validateRequest } from "@/lib/lucia/auth";
import { trackingOrderEmailTemplate } from "@/lib/utils/emailTemplates";
import { sendEmail } from "@/lib/utils/sendEmail";
import { Order } from "@/schemas/mongoose/order/order.model";
import { Stripe, stripe } from "@/services/api/stripe";
import { getRestaurant } from "@/services/mongoose/store/restaurant.dal";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  let event;

  const STRIPE_ENDPOINT_SECRET = process.env.STRIPE_WEBHOOK_SECRET;
  if (!STRIPE_ENDPOINT_SECRET) {
    throw new Error("Stripe webhook secret is missing");
  }

  try {
    const signature = req.headers.get("stripe-signature");
    const data = await req.text();
    event = stripe.webhooks.constructEvent(data, signature as string, STRIPE_ENDPOINT_SECRET);

    switch (event.type) {
      case "payment_intent.succeeded":
        await onPaymentSucceeded(event);
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ message: `webhook error: ${error.message}` }, { status: 400 });
  }

  return NextResponse.json({ status: 200 });
}

const onPaymentSucceeded = async (event: Stripe.PaymentIntentSucceededEvent) => {
  const paymentIntent = event.data.object;
  const charge = await stripe.charges.retrieve(paymentIntent.latest_charge as string);

  const isPaid = paymentIntent.status === "succeeded";
  const paidAt = new Date(paymentIntent.created * 1000);
  const paymentMethod = await stripe.paymentMethods.retrieve(paymentIntent.payment_method as string);
  const paymentResult = {
    id: paymentIntent.id,
    status: paymentIntent.status,
    receiptUrl: charge.receipt_url ?? "",
    paidAt: paidAt,
  };

  const orderId = event.data.object.metadata?.orderId;

  if (!orderId) {
    throw new Error("Invalid order id");
  }

  const order = await Order.findById(orderId).exec();

  if (!order) {
    throw new Error("Order not found");
  }

  order.isPaid = isPaid;
  order.paymentMethod = paymentMethod.type;
  order.paymentResult = paymentResult;
  order.orderStatus = "paid";

  await order.save();

  const { user } = await validateRequest();
  if (!user && paymentIntent.receipt_email) {
    const trackingUrl = process.env.BASE_URL + "/my/orders/" + order._id.toString() + "?token=" + order.trackingToken;

    if (process.env.NODE_ENV !== "development") {
      const { name } = await getRestaurant();
      await sendEmail(
        paymentIntent.receipt_email,
        `${name} - Order ${order._id} Paid`,
        trackingOrderEmailTemplate(name, order.deliveryInfo.deliveryPerson.name, trackingUrl)
      );
    } else {
      console.log("Tracking URL:", trackingUrl);
    }
  }

  revalidatePath("/my/orders", "layout");
  revalidatePath("/store/orders", "layout");
};
