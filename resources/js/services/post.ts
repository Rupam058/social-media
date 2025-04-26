import { KyInstance } from "ky";
import { http } from "../utils/http";
import { Post, PostResponse } from "../model/post";
import { PaginatedResponse } from "../model/http";
import { Comment } from "../model/comment";

export class PostSerives {
    private httpClient: KyInstance = http("/api/posts");

    async getPosts(page: number): Promise<PaginatedResponse<PostResponse>> {
        return this.httpClient.get(`?page=${page}`).json();
    }

    async getPostComments(postId: string): Promise<Comment[]> {
        return this.httpClient.get(`${postId}/comments`).json();
    }

    async createPost(
        caption: string,
        file: File | null,
    ): Promise<PostResponse> {
        const formData = new FormData();
        formData.append("caption", caption);

        if (file != null) {
            formData.append("image", file);
        }

        return await this.httpClient
            .post("", {
                body: formData,
            })
            .json();
    }
}
