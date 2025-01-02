import { z } from "zod";

export const planFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  codename: z.string().min(1, "Codename is required"),
  default: z.boolean().default(false),
  isLifetime: z.boolean().default(false),

  monthlyPrice: z.number().min(0, "Monthly price must be non-negative"),
  monthlyPriceAnchor: z
    .number()
    .min(0, "Monthly anchor price must be non-negative"),
  monthlyStripePriceId: z.string().nullable(),
  monthlyLemonSqueezyProductId: z.string().nullable(),

  yearlyPrice: z.number().min(0, "Yearly price must be non-negative"),
  yearlyPriceAnchor: z
    .number()
    .min(0, "Yearly anchor price must be non-negative"),
  yearlyStripePriceId: z.string().nullable(),
  yearlyLemonSqueezyProductId: z.string().nullable(),

  onetimePrice: z.number().min(0, "One-time price must be non-negative"),
  onetimePriceAnchor: z
    .number()
    .min(0, "One-time anchor price must be non-negative"),
  onetimeStripePriceId: z.string().nullable(),
  onetimeLemonSqueezyProductId: z.string().nullable(),

  featuresList: z.array(z.string()).min(1, "At least one feature is required"),
  quotas: z.object({
    canDoSomething: z.boolean(),
    numberOfThings: z.number().min(0),
    somethingElse: z.string(),
  }),
});

export type PlanFormValues = z.infer<typeof planFormSchema>;
