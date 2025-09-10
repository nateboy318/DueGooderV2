"use client";

import useSWR from "swr";
import { useSession } from "next-auth/react";

interface UserData {
  name: string | null;
  email: string;
}

export default function useUserName() {
  const { data: session } = useSession();
  
  const { data: userData, error, isLoading } = useSWR<UserData>(
    session?.user?.id ? `/api/app/user/name` : null
  );

  return {
    userName: userData?.name,
    userEmail: userData?.email,
    isLoading,
    error
  };
}
