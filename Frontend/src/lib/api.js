import axios from "axios"

let rawURL = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/$/, "")
if (!rawURL.endsWith("/api")) {
    rawURL += "/api"
}

export const api = axios.create({
    baseURL: rawURL,
    withCredentials: true,
})

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token")
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

export function getErrorMessage(error, fallbackMessage) {
    return error?.response?.data?.message || fallbackMessage
}
