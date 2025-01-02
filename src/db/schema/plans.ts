import {
  boolean,
  timestamp,
  pgTable,
  text,
  integer,
  jsonb,
} from "drizzle-orm/pg-core";
import { z } from "zod";

export const quotaSchema = z.object({
  canDoSomething: z.boolean(),
  numberOfThings: z.number(),
  somethingElse: z.string(),
});

export type Quotas = z.infer<typeof quotaSchema>;

export const plans = pgTable("plans", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  codename: text("codename").unique(),
  default: boolean("default").default(false),

  isLifetime: boolean("isLifetime").default(false),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow(),

  monthlyPrice: integer("monthlyPrice"),
  monthlyPriceAnchor: integer("monthlyPriceAnchor"),
  monthlyStripePriceId: text("monthlyStripePriceId"),
  monthlyLemonSqueezyProductId: text("monthlyLemonSqueezyProductId"),

  yearlyPrice: integer("yearlyPrice"),
  yearlyPriceAnchor: integer("yearlyPriceAnchor"),
  yearlyStripePriceId: text("yearlyStripePriceId"),
  yearlyLemonSqueezyProductId: text("yearlyLemonSqueezyProductId"),

  onetimePrice: integer("onetimePrice"),
  onetimePriceAnchor: integer("onetimePriceAnchor"),
  onetimeStripePriceId: text("onetimeStripePriceId"),
  onetimeLemonSqueezyProductId: text("onetimeLemonSqueezyProductId"),

  featuresList: jsonb("featuresList").$type<string[]>(),
  quotas: jsonb("quotas").$type<Quotas>(),
});
