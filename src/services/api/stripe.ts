import Stripe from "stripe";

if (!process.env.STRIPE_API_KEY) {
  throw new Error("Stripe API key is missing");
}

const stripe = new Stripe(process.env.STRIPE_API_KEY, {
  typescript: true,
  apiVersion: "2024-06-20",
});

export { Stripe, stripe };
