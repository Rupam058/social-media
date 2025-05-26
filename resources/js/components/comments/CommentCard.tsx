import { Link } from "wouter";
import { APP_BASE_URL, commentService, DEFAULT_AVATAR } from "../../bootstarp";
import { Comment, CommentResponse } from "../../model/comment";
import Avatar from "../base/Avatar";
import { useContext, useState, useEffect } from "react";
import { ProfileResponse } from "../../model/user";
import { authContext } from "../../context/auth";
import Button from "../base/Button";
import Modal from "../base/Modal";

interface CommentCardProps {
    comment: CommentResponse;
    onDelete?: (commentId: string) => void;
    onUpdate?: (commentId: string, newContent: string) => void;
}

function CommentCard({ comment, onDelete, onUpdate }: CommentCardProps) {
    const imageUrl = comment.author.avatar
        ? `${APP_BASE_URL}/storage/avatars/${comment.author.avatar}`
        : DEFAULT_AVATAR;

    // Format the timestamp to a more readable format
    const formatTimestamp = (timestamp: string): string => {
        const commentDate = new Date(timestamp);
        const now = new Date();
        const diffInSeconds = Math.floor(
            (now.getTime() - commentDate.getTime()) / 1000,
        );

        // Less than a minute
        if (diffInSeconds < 60) {
            return "just now";
        }

        // Less than an hour
        if (diffInSeconds < 3600) {
            const minutes = Math.floor(diffInSeconds / 60);
            return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
        }

        // Less than a day
        if (diffInSeconds < 86400) {
            const hours = Math.floor(diffInSeconds / 3600);
            return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
        }

        // Less than a week
        if (diffInSeconds < 604800) {
            const days = Math.floor(diffInSeconds / 86400);
            return `${days} ${days === 1 ? "day" : "days"} ago`;
        }

        // Format as date
        const options: Intl.DateTimeFormatOptions = {
            year: "numeric",
            month: "short",
            day: "numeric",
        };
        return commentDate.toLocaleDateString(undefined, options);
    };

    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [editContent, setEditContent] = useState<string>(
        comment.comment.content,
    );
    const [isDeleting, setIsDeleting] = useState<boolean>(false);
    const [isDeleted, setIsDeleted] = useState<boolean>(false);
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
    const auth = useContext(authContext);

    // Check if the current user is the author of the comment
    const isAuthor =
        auth.authenticatedUser?.username === comment.author.username;

    async function updateComment() {
        if (!isAuthor) return;

        try {
            const success = await commentService.updateComment(
                comment.comment.id,
                editContent,
            );

            if (success) {
                // Update the local comment content
                comment.comment.content = editContent;
                setIsEditing(false);

                // Notify parent component about the update
                if (onUpdate) {
                    onUpdate(comment.comment.id, editContent);
                }
            }
        } catch (error) {
            console.error("Failed to update comment:", error);
        }
    }

    async function deleteComment() {
        if (!isAuthor) return;

        setIsDeleting(true);
        try {
            const success = await commentService.deleteComment(
                comment.comment.id,
            );

            if (success) {
                setIsDeleted(true);
                setShowDeleteModal(false);

                // Notify parent component about the deletion
                if (onDelete) {
                    onDelete(comment.comment.id);
                }
            }
        } catch (error) {
            console.error("Failed to delete comment:", error);
        } finally {
            setIsDeleting(false);
        }
    }

    function cancelEdit() {
        setIsEditing(false);
        setEditContent(comment.comment.content);
    }

    function openDeleteModal() {
        setShowDeleteModal(true);
    }

    function closeDeleteModal() {
        setShowDeleteModal(false);
    }

    // If the comment is deleted, don't render anything
    if (isDeleted) {
        return null;
    }

    return (
        <>
            <div className="flex items-start gap-4">
                <Avatar image={imageUrl} customClass="w-10 h-10" />
                <div className="flex-1">
                    <Link to={`profile/${comment.author.username}`}>
                        <b className="text-sm">
                            {comment.author.name} (@{comment.author.username})
                        </b>
                    </Link>

                    {isEditing ? (
                        <div className="mt-1">
                            <textarea
                                className="w-full p-2 border rounded text-sm"
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                            />
                            <div className="flex gap-2 mt-1">
                                <Button
                                    color="blue"
                                    size="small"
                                    onClick={updateComment}
                                    className="text-xs"
                                >
                                    Save
                                </Button>
                                <Button
                                    color="white"
                                    size="small"
                                    onClick={cancelEdit}
                                    className="text-xs"
                                >
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <p className={"text-sm"}>{comment.comment.content}</p>
                    )}

                    <div className="flex items-center mt-2">
                        <p className={"text-xs text-gray-500"}>
                            {formatTimestamp(comment.comment.created_at)}
                        </p>

                        {isAuthor && !isEditing && (
                            <div className="ml-4 flex gap-2">
                                <Button
                                    color="white"
                                    size="small"
                                    bold={false}
                                    onClick={() => setIsEditing(true)}
                                    className="text-xs text-blue-500 border-none hover:bg-transparent"
                                >
                                    Edit
                                </Button>
                                <Button
                                    color="white"
                                    size="small"
                                    bold={false}
                                    onClick={openDeleteModal}
                                    className={`text-xs text-red-500 border-none hover:bg-transparent ${isDeleting ? "opacity-50 cursor-not-allowed" : ""}`}
                                >
                                    {isDeleting ? "Deleting..." : "Delete"}
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            <Modal open={showDeleteModal} onClose={closeDeleteModal} className="border max-w-md">
                <div className="text-center">
                    <h3 className="text-lg font-bold mb-4">Delete Comment</h3>
                    <p className="mb-6">
                        Are you sure you want to delete this comment? This
                        action cannot be undone.
                    </p>
                    <div className="flex justify-center gap-4">
                        <Button color="white" onClick={closeDeleteModal}>
                            Cancel
                        </Button>
                        <Button
                            color="red"
                            onClick={deleteComment}
                            className={
                                isDeleting
                                    ? "opacity-50 cursor-not-allowed"
                                    : ""
                            }
                        >
                            {isDeleting ? "Deleting..." : "Delete"}
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    );
}

export default CommentCard;
