import stripeClient from 'stripe';

const stripe = new stripeClient(process.env.STRIPE_SECRET_KEY!)

export default stripe;