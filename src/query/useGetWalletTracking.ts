import { useQuery } from "@tanstack/react-query";
import { MainServices } from "@/services/api.ts";

export const GET_WALLET_TRACKING = "GET_WALLET_TRACKING";

export const useGetWalletTracking = ({
  search,
  page,
  limit,
}: {
  search?: string;
  page?: number;
  limit?: number;
}) => {
  return useQuery({
    queryKey: [GET_WALLET_TRACKING, search, page, limit],
    queryFn: async () =>
      await MainServices.getWalletTracking({
        searchString: search,
        page,
        limit,
      }),
  });
};
