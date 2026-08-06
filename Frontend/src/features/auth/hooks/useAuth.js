import { useContext } from "react";
import { AuthContext } from "../auth.context";
import { login, register, logout } from "../services/auth.api";
import { getErrorMessage } from "../../../lib/api";


export const useAuth = () => {

    const context = useContext(AuthContext)

    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider")
    }

    const { user, setUser, loading, setLoading, error, setError } = context


    const handleLogin = async ({ email, password }) => {
        setLoading(true)
        setError("")
        try {
            const data = await login({ email, password })
            setUser(data.user)
            return data.user
        } catch (err) {
            const message = getErrorMessage(err, "Login failed.")
            setUser(null)
            setError(message)
            throw new Error(message)
        } finally {
            setLoading(false)
        }
    }

    const handleRegister = async ({ username, email, password }) => {
        setLoading(true)
        setError("")
        try {
            const data = await register({ username, email, password })
            setUser(data.user)
            return data.user
        } catch (err) {
            const message = getErrorMessage(err, "Registration failed.")
            setUser(null)
            setError(message)
            throw new Error(message)
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = async () => {
        setLoading(true)
        setError("")
        try {
            await logout()
            setUser(null)
            return true
        } catch (err) {
            const message = getErrorMessage(err, "Logout failed.")
            setError(message)
            throw new Error(message)
        } finally {
            setLoading(false)
        }
    }

    return { user, loading, error, handleRegister, handleLogin, handleLogout }
}
