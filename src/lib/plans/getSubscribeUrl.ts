import { z } from "zod";

export enum PlanType {
  MONTHLY = "monthly",
  YEARLY = "yearly",
  ONETIME = "onetime",
}

export enum PlanProvider {
  STRIPE = "stripe",
  LEMON_SQUEEZY = "lemonsqueezy",
  DODO = "dodo",
}

const trialPeriodDays = [7, 14];

export const subscribeParams = z.object({
  codename: z.string(),
  type: z.nativeEnum(PlanType),
  provider: z.nativeEnum(PlanProvider),
  trialPeriodDays: z
    .number()
    .optional()
    .refine(
      (n) => {
        if (n === undefined || n === null) {
          return true;
        }
        return trialPeriodDays.includes(n);
      },
      {
        message: `Trial period days must be ${trialPeriodDays.join(" or ")}`,
      }
    ),
});

export type SubscribeParams = z.infer<typeof subscribeParams>;

const getSubscribeUrl = ({
  codename,
  type,
  provider,
  trialPeriodDays,
}: SubscribeParams) => {
  let url = `${process.env.NEXT_PUBLIC_APP_URL}/app/subscribe?codename=${codename}&type=${type}&provider=${provider}`;
  if (trialPeriodDays) {
    url += `&trialPeriodDays=${trialPeriodDays}`;
  }
  return url;
};

export default getSubscribeUrl;
