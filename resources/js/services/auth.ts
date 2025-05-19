import { KyInstance } from "ky";
import { http } from "../utils/http";

export interface UserDetails {
    email: string;
    username: string;
    avatar: string;
}

export class AuthService {
    private httpClient: KyInstance = http("/auth");
    public user: UserDetails | null = null;
    
    async loginWithPassword(
        email: string,
        password: string,
    ): Promise<UserDetails | null> {
        try {
            await this.httpClient.post("login", {
                json: {
                    email,
                    password,
                },
            });

            return await this.loadUser();
        } catch (error) {
            throw new Error("Invalid email or password");
        }
    }

    async loadUser(): Promise<UserDetails | null> {
        try {
            this.user = await this.httpClient.get("user").json();
            return this.user;
        } catch (_) {
            return null;
        }
    }
}
