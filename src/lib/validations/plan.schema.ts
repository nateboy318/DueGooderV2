import { quotaSchema } from "@/db/schema/plans";
import { z } from "zod";

export const planFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  codename: z.string().min(1, "Codename is required"),
  default: z.boolean().default(false),
  hasOnetimePricing: z.boolean().default(false),
  hasMonthlyPricing: z.boolean().default(false),
  hasYearlyPricing: z.boolean().default(false),

  requiredCouponCount: z.number().min(0, "Required coupons must be non-negative").nullable(),

  monthlyPrice: z.number().min(0, "Monthly price must be non-negative"),
  monthlyPriceAnchor: z
    .number()
    .min(0, "Monthly anchor price must be non-negative"),
  monthlyStripePriceId: z.string().nullable(),
  monthlyLemonSqueezyVariantId: z.string().nullable(),
  monthlyDodoProductId: z.string().nullable(),
  monthlyPaypalPlanId: z.string().nullable(),
  yearlyPrice: z.number().min(0, "Yearly price must be non-negative"),
  yearlyPriceAnchor: z
    .number()
    .min(0, "Yearly anchor price must be non-negative"),
  yearlyStripePriceId: z.string().nullable(),
  yearlyLemonSqueezyVariantId: z.string().nullable(),
  yearlyDodoProductId: z.string().nullable(),
  yearlyPaypalPlanId: z.string().nullable(),
  onetimePrice: z.number().min(0, "One-time price must be non-negative"),
  onetimePriceAnchor: z
    .number()
    .min(0, "One-time anchor price must be non-negative"),
  onetimeStripePriceId: z.string().nullable(),
  onetimeLemonSqueezyVariantId: z.string().nullable(),
  onetimeDodoProductId: z.string().nullable(),
  onetimePaypalPlanId: z.string().nullable(),
  quotas: quotaSchema,
});

export type PlanFormValues = z.infer<typeof planFormSchema>;
