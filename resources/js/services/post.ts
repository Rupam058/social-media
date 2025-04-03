import { KyInstance } from "ky";
import { http } from "../utils/http";
import { Post } from "../model/post";

export class PostSerives {
    private httpClient: KyInstance = http("/api/posts");

    async getPosts(): Promise<{ data: Post[] }> {
        return this.httpClient.get("").json();
    }

    async createPost() {
        const formData = new FormData();
        formData.append("caption", "Hello World!");

        await this.httpClient.post("", {
            body: formData,
        });
    }
}
