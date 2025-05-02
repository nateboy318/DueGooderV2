import { MeResponse } from "@/app/api/app/me/types";
import useSWR from "swr";

const useCurrentPlan = () => {
  const { data, isLoading, error, mutate } = useSWR<MeResponse>("/api/app/me");

  return { currentPlan: data?.currentPlan, isLoading, error, mutate };
};

export default useCurrentPlan;
