"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  planFormSchema,
  type PlanFormValues,
} from "@/lib/validations/plan.schema";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { Loader2 } from "lucide-react";

interface PlanFormProps {
  initialData?: PlanFormValues;
  onSubmit: (data: PlanFormValues) => Promise<void>;
  submitLabel?: string;
}

export function PlanForm({
  initialData,
  onSubmit,
  submitLabel = "Save Plan",
}: PlanFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<PlanFormValues>({
    resolver: zodResolver(planFormSchema),
    defaultValues: initialData || {
      name: "",
      codename: "",
      default: false,
      hasOnetimePricing: false,
      hasMonthlyPricing: false,
      monthlyStripePriceId: "",
      monthlyLemonSqueezyVariantId: "",
      monthlyDodoProductId: "",
      hasYearlyPricing: false,
      yearlyStripePriceId: "",
      yearlyLemonSqueezyVariantId: "",
      yearlyDodoProductId: "",
      monthlyPrice: 0,
      monthlyPriceAnchor: 0,
      yearlyPrice: 0,
      yearlyPriceAnchor: 0,
      onetimePrice: 0,
      onetimeStripePriceId: "",
      onetimeLemonSqueezyVariantId: "",
      onetimeDodoProductId: "",
      onetimePriceAnchor: 0,
      quotas: {
        canUseApp: false,
        numberOfThings: 0,
        somethingElse: "",
      },
    },
  });

  const handleSubmit = async (data: PlanFormValues) => {
    try {
      setIsSubmitting(true);
      await onSubmit(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasOnetimePricing = form.watch("hasOnetimePricing");
  const hasMonthlyPricing = form.watch("hasMonthlyPricing");
  const hasYearlyPricing = form.watch("hasYearlyPricing");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Basic Information</h3>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Pro Plan" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="codename"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Codename</FormLabel>
                  <FormControl>
                    <Input placeholder="pro" {...field} />
                  </FormControl>
                  <FormDescription>
                    Unique identifier for the plan (e.g., &ldquo;pro&rdquo;,
                    &ldquo;basic&rdquo;)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="default"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2">
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="!mt-0">Default Plan</FormLabel>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="hasOnetimePricing"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2">
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="!mt-0">One-time Pricing</FormLabel>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="hasMonthlyPricing"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2">
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="!mt-0">Monthly Pricing</FormLabel>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="hasYearlyPricing"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2">
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="!mt-0">Yearly Pricing</FormLabel>
                </FormItem>
              )}
            />
          </div>

          {/* Pricing */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Pricing</h3>
            <div className="grid gap-4">
              {hasMonthlyPricing && (
                <div className="space-y-4">
                  <h4 className="font-medium">Monthly</h4>
                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="monthlyPrice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price (Cents)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="monthlyPriceAnchor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Anchor Price (Cents)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="monthlyStripePriceId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Stripe Price ID</FormLabel>
                          <FormControl>
                            <Input {...field} value={field.value || ""} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="monthlyLemonSqueezyVariantId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>LemonSqueezy Product ID</FormLabel>
                          <FormControl>
                            <Input {...field} value={field.value || ""} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="monthlyDodoProductId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Dodo Product ID</FormLabel>
                          <FormControl>
                            <Input {...field} value={field.value || ""} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}

              {hasYearlyPricing && (
                <div className="space-y-4">
                  <h4 className="font-medium">Yearly</h4>
                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="yearlyPrice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price (Cents)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="yearlyPriceAnchor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Anchor Price (Cents)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="yearlyStripePriceId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Stripe Price ID</FormLabel>
                          <FormControl>
                            <Input {...field} value={field.value || ""} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="yearlyLemonSqueezyVariantId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>LemonSqueezy Product ID</FormLabel>
                          <FormControl>
                            <Input {...field} value={field.value || ""} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="yearlyDodoProductId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Dodo Product ID</FormLabel>
                          <FormControl>
                            <Input {...field} value={field.value || ""} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}

              {hasOnetimePricing && (
                <div className="space-y-4">
                  <h4 className="font-medium">One-time</h4>
                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="onetimePrice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price (Cents)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="onetimePriceAnchor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Anchor Price (Cents)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="onetimeStripePriceId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Stripe Price ID</FormLabel>
                          <FormControl>
                            <Input {...field} value={field.value || ""} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="onetimeLemonSqueezyVariantId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>LemonSqueezy Product ID</FormLabel>
                          <FormControl>
                            <Input {...field} value={field.value || ""} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="onetimeDodoProductId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Dodo Product ID</FormLabel>
                          <FormControl>
                            <Input {...field} value={field.value || ""} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quotas */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-medium">Quotas</h3>
            <p className="text-sm text-muted-foreground">
              Can be used in code to limit the number of things a user can do.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <FormField
              control={form.control}
              name="quotas.canUseApp"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2">
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="!mt-0">Can Use App</FormLabel>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="quotas.numberOfThings"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Things</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="quotas.somethingElse"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Something Else</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {submitLabel}
        </Button>
      </form>
    </Form>
  );
}
