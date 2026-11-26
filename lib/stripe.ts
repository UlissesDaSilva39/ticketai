import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_not_configured", { // placeholder: app builds without Stripe; payments fail until STRIPE_SECRET_KEY is added
  typescript: true,
});
