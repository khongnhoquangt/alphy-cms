import axios from "axios";

export const api = axios.create({
    baseURL: 'https://alphy.aptoso.com/api/v1'
})

export const MainServices = {
    getSummary: async () => await api.get(`/user/wallet-tracking/summary`)
}