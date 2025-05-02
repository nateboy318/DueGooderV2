"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Link from "next/link";
import useSWR from "swr";
import { toast } from "sonner";

interface User {
  id: string;
  name: string | null;
  email: string;
}

export default function DeleteUserPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const [confirmation, setConfirmation] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const { data: user, error, isLoading } = useSWR<User>(
    `/api/super-admin/users/${id}`
  );

  const confirmationText = `delete this user`;

  const handleDelete = async () => {
    if (!user) return;
    if (confirmation !== confirmationText) {
      toast.error("Please enter the correct confirmation text");
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/super-admin/users/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      toast.success("User deleted successfully");
      router.push("/super-admin/users");
    } catch (error) {
      toast.error("Failed to delete user");
      console.error(error);
      setIsDeleting(false);
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
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/super-admin/users/${id}`}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Delete User</h1>
      </div>

      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Warning: This action cannot be undone</AlertTitle>
        <AlertDescription>
          Deleting this user will permanently remove their account and all associated data.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Confirm Deletion</CardTitle>
          <CardDescription>
            Please review the information below carefully.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-medium">Email:</p>
            <p className="text-sm">{user?.email}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Name:</p>
            <p className="text-sm">{user?.name || "Unnamed User"}</p>
          </div>
          <div>
            <p className="text-sm font-medium">User ID:</p>
            <p className="text-sm font-mono">{user?.id}</p>
          </div>

          <div className="pt-4">
            <p className="text-sm font-medium mb-2">
              To confirm deletion, type &quot;{confirmationText}&quot; below:
            </p>
            <Input
              value={confirmation}
              onChange={(e) => setConfirmation(e.target.value)}
              placeholder={confirmationText}
              className="max-w-md"
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline" 
            asChild
          >
            <Link href={`/super-admin/users/${id}`}>
              Cancel
            </Link>
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={
              isDeleting || 
              confirmation !== confirmationText
            }
          >
            {isDeleting ? "Deleting..." : "Delete User"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
} 