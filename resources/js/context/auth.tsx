import { createContext, ReactNode, useEffect, useState } from "react";
import { UserDetails } from "../services/auth";
import { APP_BASE_URL, authService } from "../bootstarp";

export interface AuthContext {
    loaded: boolean;
    authenticatedUser: UserDetails | null;
    login: (email: string, password: string) => Promise<boolean>;
    register: (email: string, password: string) => Promise<boolean>;
    resetPassword: (email: string) => Promise<void>;
    logout: () => Promise<void>;
}

export const authContext = createContext<AuthContext>({} as AuthContext);

export const AuthProvider = (props: { children: ReactNode }) => {
    const [authenticatedUser, setAuthenticatedUser] =
        useState<UserDetails | null>(null);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        loadAuthenticatedUser();
    }, []);

    const loadAuthenticatedUser = async () => {
        // loading CSRF cookies in the initial load.
        await fetch(`${APP_BASE_URL}/sanctum/csrf-cookie`, {
            method: "GET",
            credentials: "include",
            headers: {
                Accept: "application/json",
            },
        });

        const user = await authService.loadUser();
        setAuthenticatedUser(user);
        setLoaded(true);
    };

    const login = async (email: string, password: string) => {
        const user = await authService.loginWithPassword(email, password);
        setAuthenticatedUser(user);

        return user != null;
    };

    const register = async (email: string, password: string) => {
        return await authService.register(email, password);
    };

    const resetPassword = async (email: string) => {
        await authService.resetPassword(email);
    };

    const logout = async () => {
        await authService.logout();
        setAuthenticatedUser(null);
    };

    return (
        <authContext.Provider
            value={{
                loaded,
                authenticatedUser,
                login,
                register,
                resetPassword,
                logout,
            }}
        >
            {props.children}
        </authContext.Provider>
    );
};
