import axios from "axios";
import Cookies from "js-cookie";

export const api = axios.create({
  baseURL: "https://alphy.aptoso.com/api/v1",
});

// Add request interceptor to dynamically get the token on each request
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get("auth_token");
    if (token) {
      config.headers["X-Api-Key"] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export const MainServices = {
  getSummary: async () => await api.get(`/user/wallet-tracking/summary`),
  getWalletTracking: async (params: {
    searchString?: string;
    page?: number;
    limit?: number;
  }) =>
    await api.get(`/user/wallet-tracking`, {
      params,
    }),
};
