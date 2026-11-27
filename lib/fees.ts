// Fees GRID charges, in one place so the checkout page and the server always agree.

/** Booking fee added to ticket orders (paid by the buyer, kept by GRID). */
export const TICKET_BOOKING_FEE_RATE = 0.05;

/** GRID selling fee on Marketplace and Licensing sales: 10%, or 5% for Premium sellers. */
export const SELLER_FEE_RATE = 0.1;
export const PREMIUM_SELLER_FEE_RATE = 0.05;
export const sellerFeeRate = (tier: string | null | undefined) => (tier === "premium" ? PREMIUM_SELLER_FEE_RATE : SELLER_FEE_RATE);
export const feePercentLabel = (rate: number) => `${Math.round(rate * 100)}%`;

/** Booking fee in pounds for a ticket subtotal in pounds (rounded to the penny). */
export const ticketBookingFee = (subtotalPounds: number) => (subtotalPounds > 0 ? Math.round(subtotalPounds * TICKET_BOOKING_FEE_RATE * 100) / 100 : 0);
