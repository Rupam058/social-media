import { KyInstance } from "ky";
import { http } from "../utils/http";
import { ProfileResponse } from "../model/user";

export class UserService {
    private httpClient: KyInstance = http("/api/user");

    async getUserByUsername(username: string): Promise<ProfileResponse | null> {
        try {
            let user = await this.httpClient.get(`${username}`);
            return user.json();
        } catch (error) {
            return null;
        }
    }

    async updateUsername(username: string) {
        try {
            const response = await this.httpClient.post("username", {
                body: username,
            });

            return response.ok;
        } catch (error: any) {
            // Ky throws an error for non-2xx responses
            if (error.response) {
                // First try to get the response as text
                const responseText = await error.response.text();
                if (responseText) {
                    throw new Error(responseText);
                }
            }

            // If we couldn't extract a specific error message, use a generic one
            throw new Error("Failed to update username");
        }
    }

    async updateName(name: string) {
        const nameResponse = await this.httpClient.post("name", {
            body: name,
        });

        if (nameResponse.ok) {
            return true;
        } else {
            throw new Error("Failed to update name");
        }
    }

    async updateAvatar(file: File): Promise<string> {
        const formData = new FormData();
        if (file != null) {
            formData.append("image", file);
        }

        const avatar = await this.httpClient.post("avatar", {
            body: formData,
        });

        return avatar.text();
    }

    async updateBanner(file: File): Promise<string> {
        const formData = new FormData();
        if (file != null) {
            formData.append("image", file);
        }

        const banner = await this.httpClient.post("banner", {
            body: formData,
        });

        return banner.text();
    }

    async updateDescription(descrip: string) {
        const description = await this.httpClient.post("description", {
            body: descrip,
        });

        return description.ok;
    }
}
