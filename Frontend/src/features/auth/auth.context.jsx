import { useEffect, useState } from "react";
import { AuthContext } from "./auth.context";
import { getMe } from "./services/auth.api";


export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        let isMounted = true

        const getAndSetUser = async () => {
            try {
                const data = await getMe()

                if (isMounted) {
                    setUser(data.user)
                    setError("")
                }
            } catch {
                if (isMounted) {
                    setUser(null)
                }
            } finally {
                if (isMounted) {
                    setLoading(false)
                }
            }
        }

        getAndSetUser()

        return () => {
            isMounted = false
        }
    }, [])

    return (
        <AuthContext.Provider value={{ user, setUser, loading, setLoading, error, setError }} >
            {children}
        </AuthContext.Provider>
    )
}
