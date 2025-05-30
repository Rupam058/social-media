import { KyInstance } from "ky";
import { http } from "../utils/http";
import { Post, PostResponse } from "../model/post";
import { PaginatedResponse } from "../model/http";
import { Comment, CommentResponse } from "../model/comment";

export class PostSerives {
    private httpClient: KyInstance = http("/api/posts");

    async getPosts(
        page: number,
        user: string | null,
    ): Promise<PaginatedResponse<PostResponse>> {
        let userParam = user != null ? `&user=${user}` : "";
        return this.httpClient.get(`?page=${page}${userParam}`).json();
    }

    async getPostComments(postId: string): Promise<CommentResponse[]> {
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

    async updatePost(postId: string, content: string) {
        const post = await this.httpClient.put(`${postId}`, {
            json: {
                content: content,
            },
        });
        return post.ok;
    }

    async deletePost(postId: string): Promise<boolean> {
        return (await this.httpClient.delete(`${postId}`)).ok;
    }
}
