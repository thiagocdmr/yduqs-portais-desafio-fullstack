import axios from "axios";
import config from "../config";

export const api = axios.create({
    baseURL: config.apiUrl,
    timeout: config.timeout,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error("API Error:", error.response?.data || error.message);
        return Promise.reject(error);
    }
);
