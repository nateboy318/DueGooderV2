import { MeResponse } from "@/app/api/app/me/types";
import useSWR from "swr";

const useCurrentPlan = () => {
  const { data, isLoading, error } = useSWR<MeResponse>("/api/app/me");

  return { currentPlan: data?.currentPlan, isLoading, error };
};

export default useCurrentPlan;
