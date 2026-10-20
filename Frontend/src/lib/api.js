import axios from "axios"

let rawBaseURL = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").trim().replace(/\/+$/, "")
if (!rawBaseURL.endsWith("/api")) {
    rawBaseURL = `${rawBaseURL}/api`
}

export const api = axios.create({
    baseURL: rawBaseURL,
    withCredentials: true,
})

api.interceptors.request.use((config) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

export function getErrorMessage(error, fallbackMessage) {
    return error?.response?.data?.message || fallbackMessage
}
