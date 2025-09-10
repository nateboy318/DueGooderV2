"use client";

import useSWR from "swr";

interface GoogleAccount {
  hasGoogleAccount: boolean;
  hasCalendarScope: boolean;
  needsReauth: boolean;
  scope?: string;
}

export default function useGoogleAccount(shouldFetch: boolean = true) {
  const { data, error, isLoading } = useSWR<GoogleAccount>(
    shouldFetch ? "/api/app/google-account" : null
  );

  return {
    googleAccount: data,
    isLoading,
    error,
  };
}
