import { MeResponse } from "@/app/api/app/me/types";
import useSWR from "swr";

const useUser = () => {
  const { data, isLoading, error } = useSWR<MeResponse>("/api/app/me");

  return { user: data?.user, isLoading, error };
};

export default useUser;
