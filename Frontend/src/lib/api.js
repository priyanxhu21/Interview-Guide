import axios from "axios"

const baseURL = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/$/, "")

export const api = axios.create({
    baseURL,
    withCredentials: true,
})

export function getErrorMessage(error, fallbackMessage) {
    return error?.response?.data?.message || fallbackMessage
}
