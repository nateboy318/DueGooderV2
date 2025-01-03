export enum PlanType {
  MONTHLY = "monthly",
  YEARLY = "yearly",
  ONETIME = "onetime",
}

export enum PlanProvider {
  STRIPE = "stripe",
  LEMON_SQUEEZY = "lemonsqueezy",
}

export type SubscribeParams = {
  codename: string;
  type: PlanType;
  provider: PlanProvider;
};

const getSubscribeUrl = ({ codename, type, provider }: SubscribeParams) => {
  return `${process.env.NEXT_PUBLIC_APP_URL}/subscribe?codename=${codename}&type=${type}&provider=${provider}`;
};

export default getSubscribeUrl;
