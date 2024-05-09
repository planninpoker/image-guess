import {createContext, ReactNode, useContext} from "react";
import {AuthUser} from "gmaker/src/auth/iron-session/iron-session";
import {useQuery} from "@tanstack/react-query";
import axios from "axios";

type AuthContextType = {
    user: AuthUser | undefined;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
    user: undefined,
    isLoading: false,
})

export const useAuthContext = () => {
    const context = useContext(AuthContext)

    if (!context) {
        throw new Error("useAuthContext must be used within an AuthProvider")
    }

    return context
}

const useFetchUser = () => {
    return useQuery({
        queryKey: ["user"],
        staleTime: Infinity,
        queryFn: async () => {
            const resp = await axios.get<AuthUser>("/api/auth/me")
            return resp.data
        }
    })
}

export const AuthProvider = ({children}: {
    children: ReactNode
}) => {
    const {data, isLoading} = useFetchUser()

    return (
        <AuthContext.Provider value={{
            user: data,
            isLoading,
        }}>
            {children}
        </AuthContext.Provider>
    )
}