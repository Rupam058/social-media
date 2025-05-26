import { KyInstance } from "ky";
import { http } from "../utils/http";
import { Comment, CommentResponse } from "../model/comment";

export class CommentService {
    private httpClient: KyInstance = http("/api/comments");

    public async createComment(
        postId: string,
        content: string,
    ): Promise<CommentResponse[]> {
        return await this.httpClient
            .post("", {
                json: {
                    post_id: postId,
                    content: content,
                },
            })
            .json();
    }

    public async updateComment(commentId: string, content: string) {
        const comment = await this.httpClient.put(`${commentId}`, {
            json: {
                content: content,
            },
        });

        return comment.ok;
    }

    public async deleteComment(commentId: string): Promise<boolean> {
        return (await this.httpClient.delete(`${commentId}`)).ok;
    }
}
