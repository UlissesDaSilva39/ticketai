// Fees GRID charges, in one place so the checkout page and the server always agree.

/** Booking fee added to ticket orders (paid by the buyer, kept by GRID). */
export const TICKET_BOOKING_FEE_RATE = 0.05;

/** Booking fee in pounds for a ticket subtotal in pounds (rounded to the penny). */
export const ticketBookingFee = (subtotalPounds: number) => (subtotalPounds > 0 ? Math.round(subtotalPounds * TICKET_BOOKING_FEE_RATE * 100) / 100 : 0);
