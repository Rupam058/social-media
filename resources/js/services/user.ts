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
