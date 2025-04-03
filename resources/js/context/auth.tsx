import { createContext, ReactNode, useEffect, useState } from "react";
import { UserDetails } from "../services/auth";
import { APP_BASE_URL, authService } from "../bootstarp";

export interface AuthContext {
    authenticatedUser: UserDetails | null;
    login: (email: string, password: string) => Promise<boolean>;
}

export const authContext = createContext<AuthContext>({} as AuthContext);

export const AuthProvider = (props: { children: ReactNode }) => {
    const [authenticatedUser, setAuthenticatedUser] =
        useState<UserDetails | null>(null);

    useEffect(() => {
        loadAuthenticatedUser();
    }, []);

    const loadAuthenticatedUser = async () => {
        // loading CSRF cookies in the initial load.
        const csrfResponse = await fetch(
            `${APP_BASE_URL}/sanctum/csrf-cookie`,
            {
                method: "GET",
                credentials: "include",
                headers: {
                    Accept: "application/json",
                },
            },
        );

        const user = await authService.loadUser();
        setAuthenticatedUser(user);
    };

    const login = async (email: string, password: string) => {
        const user = await authService.loginWithPassword(email, password);
        setAuthenticatedUser(user);

        return user != null;
    };

    return (
        <authContext.Provider value={{ authenticatedUser, login }}>
            {props.children}
        </authContext.Provider>
    );
};
