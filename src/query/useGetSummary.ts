import {useQuery} from "@tanstack/react-query";
import {MainServices} from "@/services/api.ts";


export const GET_SUMMARY = 'GET_SUMMARY'

export const useGetSummary = () => {
    return useQuery({
        queryKey: [GET_SUMMARY],
        queryFn: async () => await MainServices.getSummary()
    })
}