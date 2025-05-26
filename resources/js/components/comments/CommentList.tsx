import { CommentResponse } from "../../model/comment";
import CommentCard from "./CommentCard";

interface CommentsListProps {
    postId: string;
    comments: CommentResponse[];
    loading?: boolean;
    error?: string | null;
    onCommentDelete?: (commentId: string) => void;
    onCommentUpdate?: (commentId: string, newContent: string) => void;
}

function CommentsList({
    postId,
    comments,
    loading = false,
    error = null,
    onCommentDelete,
    onCommentUpdate,
}: CommentsListProps) {
    const handleCommentDelete = (commentId: string) => {
        if (onCommentDelete) {
            onCommentDelete(commentId);
        }
    };

    const handleCommentUpdate = (commentId: string, newContent: string) => {
        if (onCommentUpdate) {
            onCommentUpdate(commentId, newContent);
        }
    };

    if (loading) {
        return (
            <div className="py-4 text-center text-gray-500">
                Loading comments...
            </div>
        );
    }

    if (error) {
        return <div className="py-4 text-center text-red-500">{error}</div>;
    }

    // Handle null comments safely
    const commentsList = comments || [];

    return (
        <div className="space-y-6">
            {commentsList.length === 0 ? (
                <div className="py-4 text-center text-gray-500">
                    No comments yet. Be the first to comment!
                </div>
            ) : (
                commentsList.map((comment) => (
                    <CommentCard
                        key={comment.comment.id}
                        comment={comment}
                        onDelete={handleCommentDelete}
                        onUpdate={handleCommentUpdate}
                    />
                ))
            )}
        </div>
    );
}

export default CommentsList;
