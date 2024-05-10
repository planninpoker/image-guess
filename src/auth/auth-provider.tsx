import {createContext, ReactNode, useContext} from "react";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import axios from "axios";
import {User} from "@prisma/client";

type AuthContextType = {
    user: User | undefined;
    updateUser: (name: string) => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
    user: undefined,
    updateUser: (name: string) => {},
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
            const resp = await axios.get<User>("/api/auth/me")
            return resp.data
        }
    })
}

const useMutateUser = () => {
    const queryClient = useQueryClient();
    return useMutation(
        {
            mutationFn: async (newName: string) => {
                const resp = await axios.put<User>('/api/auth/update', {name: newName});
                return resp.data;
            },
            onMutate: async (newName: string) => {
                const previousUser = queryClient.getQueryData<User>(['user']);
                queryClient.setQueryData<User>(['user'], (oldUser) => {
                    if (oldUser) {
                        return {...oldUser, name: newName};
                    }
                    return oldUser;
                });
                return {previousUser};
            },
            onError: (err, newName, context) => {
                // If the mutation fails, use the context returned by onMutate to roll back
                if (context?.previousUser) {
                    queryClient.setQueryData<User>(['user'], context.previousUser);
                }
            },
        }
    );
};

export const AuthProvider = ({children}: {
    children: ReactNode
}) => {
    const {data, isLoading} = useFetchUser()
    const {mutate} = useMutateUser();

    return (
        <AuthContext.Provider value={{
            user: data,
            updateUser: mutate,
            isLoading,
        }}>
            {children}
        </AuthContext.Provider>
    )
}