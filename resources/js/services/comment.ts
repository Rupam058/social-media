import { KyInstance } from "ky";
import { http } from "../utils/http";
import { Comment } from "../model/comment";

export class CommentService {
    private httpClient: KyInstance = http("/api/comments");

    public async createComment(
        postId: string,
        content: string,
    ): Promise<Comment[]> {
        return await this.httpClient
            .post("", {
                json: {
                    post_id: postId,
                    content: content,
                },
            })
            .json();
    }
}
