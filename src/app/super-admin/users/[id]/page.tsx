"use client";

import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trash2, User, Copy, Check, AlertTriangle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import useSWR from "swr";
import { toast } from "sonner";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { plans } from "@/db/schema/plans";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface UserDetails {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  createdAt: string;
  emailVerified: string | null;
  currentPlan: typeof plans.$inferSelect | null;
  stripeSubscriptionId: string | null;
  lemonSqueezySubscriptionId: string | null;
}

interface Plan {
  id: string;
  name: string;
  codename: string;
  default: boolean;
}

export default function UserDetailsPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [impersonationUrl, setImpersonationUrl] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [isUpdatingPlan, setIsUpdatingPlan] = useState(false);

  const { data: user, error, isLoading, mutate } = useSWR<UserDetails>(
    `/api/super-admin/users/${id}`
  );

  const { data: plansData } = useSWR<{ plans: Plan[] }>(
    "/api/super-admin/plans?limit=100"
  );

  const formatDate = (date: string | null) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString();
  };

  const handleImpersonate = async () => {
    try {
      const response = await fetch(`/api/super-admin/users/${id}/impersonate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create impersonation link");
      }
      
      const { url } = await response.json();
      setImpersonationUrl(url);
      setIsModalOpen(true);
    } catch (error) {
      toast.error("Failed to impersonate user");
      console.error("Impersonation error:", error);
    }
  };
  
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(impersonationUrl);
      setIsCopied(true);
      toast.success("Link copied to clipboard");
      
      // Reset the copied state after 2 seconds
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (error) {
      toast.error("Failed to copy link");
      console.error("Copy error:", error);
    }
  };

  const handleDirectAccess = () => {
    setIsModalOpen(false);
    window.open(impersonationUrl, "_blank");
  };

  const handlePlanChange = async (planId: string) => {
    try {
      setIsUpdatingPlan(true);
      const response = await fetch(`/api/super-admin/users/${id}/plan`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ planId }),
      });

      if (!response.ok) {
        throw new Error("Failed to update plan");
      }

      await mutate();
      toast.success("Plan updated successfully");
    } catch (error) {
      console.error("Error updating plan:", error);
      toast.error("Failed to update plan");
    } finally {
      setIsUpdatingPlan(false);
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-14rem)]">
        <div className="text-center">
          <h2 className="text-lg font-medium">Error loading user</h2>
          <p className="text-sm text-muted-foreground">
            Failed to load user details. Please try again.
          </p>
          <Button variant="ghost" size="sm" asChild className="mt-4">
            <Link href="/super-admin/users">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Users
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-14rem)]">
        <div className="text-center">
          <h2 className="text-lg font-medium">Loading...</h2>
          <p className="text-sm text-muted-foreground">
            Please wait while we load the user details.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/super-admin/users">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">User Details</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleImpersonate}
          >
            <User className="h-4 w-4 mr-2" />
            Impersonate
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => router.push(`/super-admin/users/${id}/delete`)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete User
          </Button>
        </div>
      </div>

      {/* User Impersonation Link Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Impersonation Link Generated</DialogTitle>
            <DialogDescription>
              Open this link in an incognito window to impersonate {user?.name || user?.email}.
            </DialogDescription>
          </DialogHeader>
          
          <div className="p-4 border rounded-md bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800 mb-4">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 mt-0.5 text-amber-600 dark:text-amber-400" />
              <div>
                <h4 className="text-sm font-semibold text-amber-800 dark:text-amber-300">Security Warning</h4>
                <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">
                  This link grants temporary access to {user?.email}&apos;s account. Handle with care:
                </p>
                <ul className="list-disc list-inside text-xs text-amber-700 dark:text-amber-400 mt-1">
                  <li>Only use in incognito/private browsing</li>
                  <li>Do not share with unauthorized personnel</li>
                  <li>The link expires in 30 minutes</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="grid flex-1 gap-2">
              <label htmlFor="impersonation-link" className="sr-only">Impersonation Link</label>
              <Input
                id="impersonation-link"
                value={impersonationUrl}
                readOnly
                className="font-mono text-xs"
              />
            </div>
            <Button type="button" size="sm" onClick={copyToClipboard}>
              {isCopied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
          
          <DialogFooter className="sm:justify-between">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsModalOpen(false)}
            >
              Close
            </Button>
            <Button 
              type="button" 
              size="sm" 
              onClick={handleDirectAccess}
            >
              Open Link
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>User Profile</CardTitle>
            <CardDescription>Basic information about the user.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={user?.image || undefined} />
                <AvatarFallback>
                  {user?.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase() ||
                    user?.email.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-semibold">{user?.name || "Unnamed User"}</h2>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
            </div>

            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-muted-foreground">User ID</dt>
                <dd className="text-sm font-mono mt-1">{user?.id}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Joined</dt>
                <dd className="text-sm mt-1">{formatDate(user?.createdAt || null)}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Email Verified</dt>
                <dd className="text-sm mt-1">{user?.emailVerified ? formatDate(user.emailVerified) : "No"}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Plan Details</CardTitle>
            <CardDescription>Subscription and plan information.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Current Plan</label>
                <Select
                  value={user?.currentPlan?.id || ""}
                  onValueChange={handlePlanChange}
                  disabled={isUpdatingPlan}
                >
                  <SelectTrigger className="w-full mt-1.5">
                    <SelectValue placeholder="Select a plan" />
                  </SelectTrigger>
                  <SelectContent>
                    {plansData?.plans.map((plan) => (
                      <SelectItem key={plan.id} value={plan.id}>
                        {plan.name}
                        {plan.default && " (Default)"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Plan Name</dt>
                  <dd className="text-sm mt-1">{user?.currentPlan?.name || "No Plan"}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Plan Codename</dt>
                  <dd className="text-sm font-mono mt-1">{user?.currentPlan?.codename || "N/A"}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Stripe Subscription</dt>
                  <dd className="text-sm font-mono mt-1">{user?.stripeSubscriptionId || "N/A"}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">LemonSqueezy Subscription</dt>
                  <dd className="text-sm font-mono mt-1">{user?.lemonSqueezySubscriptionId || "N/A"}</dd>
                </div>
              </dl>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 