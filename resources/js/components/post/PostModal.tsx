import { useContext } from "react";
import { PostResponse } from "../../model/post";
import Avatar from "../base/Avatar";
import { authContext } from "../../context/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp, faX } from "@fortawesome/free-solid-svg-icons";
import { CommentResponse } from "../../model/comment";
import CommentSection from "../comments/CommentSection";
import Button from "../base/Button";
import { Link } from "wouter";
import {
    APP_BASE_URL,
    commentService,
    DEFAULT_AVATAR,
    likeService,
} from "../../bootstarp";
import Modal from "../base/Modal";
import { Like } from "../../model/like";

function PostModal({
    post,
    open,
    onClose,
    onLike,
    onUnlike,
    onComment,
    comments,
    setComments,
    onCommentDelete,
    onCommentUpdate,
}: {
    post: PostResponse;
    open: boolean;
    onClose: () => void;
    onLike: (l: Like) => void;
    onUnlike: () => void;
    onComment: (c: CommentResponse[]) => void;
    comments: CommentResponse[];
    setComments: (comments: CommentResponse[]) => void;
    onCommentDelete?: (commentId: string) => void;
    onCommentUpdate?: (commentId: string, newContent: string) => void;
}) {
    const auth = useContext(authContext);

    const imageUrl = post.author.avatar
        ? `${APP_BASE_URL}/storage/avatars/${post.author.avatar}`
        : DEFAULT_AVATAR;

    async function like() {
        if (post.liked == null) {
            const like = await likeService.likePost(post.post.id);
            onLike(like);
        } else {
            await likeService.unlikePost(post.liked);
            onUnlike();
        }
    }

    async function createComment(content: string) {
        const newComments = await commentService.createComment(
            post.post.id,
            content,
        );
        onComment(newComments);
        setComments(newComments);
    }

    return (
        <Modal
            open={open}
            onClose={onClose}
            className="p-0 w-full h-full"
            fullscreen={true}
        >
            <div className="relative h-full">
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-5 right-5 z-50 bg-gray-800 shadow-lg text-gray-100 p-2 cursor-pointer rounded-full hover:bg-gray-500 hover:scale-110 transition-all focus:outline-none"
                    aria-label="Close modal"
                >
                    <FontAwesomeIcon icon={faX} size="lg" className="w-5 h-5" />
                </button>

                <div className="flex flex-col lg:flex-row h-full">
                    {/* Post image section */}
                    {post.post.image && (
                        <div className="lg:w-3/5 h-full bg-gray-200 flex items-center justify-center rounded-md border overflow-hidden">
                            <img
                                className="max-h-full max-w-full object-contain"
                                src={`${APP_BASE_URL}/storage/uploads/${post.post.image}`}
                                alt="Post image"
                            />
                        </div>
                    )}

                    {/* Post details section */}
                    <div
                        className={`${post.post.image ? "lg:w-2/5" : "w-full"} flex flex-col h-full bg-white overflow-auto`}
                    >
                        <div className="p-4 md:p-6">
                            {/* Author info */}
                            <div className="flex items-center gap-4">
                                <Avatar image={imageUrl} />
                                <div>
                                    <p className="text-xl font-medium">
                                        {post.author.name}
                                    </p>
                                    <Link
                                        className="text-sm text-blue-700 hover:underline"
                                        to={`/profile/${post.author.username}`}
                                    >
                                        @{post.author.username}
                                    </Link>
                                </div>
                            </div>

                            {/* Caption */}
                            <p className="text-lg mt-2 md:mt-4 ml-2 md:ml-4">
                                {post.post.caption}
                            </p>

                            {/* Interaction buttons */}
                            {auth.authenticatedUser && (
                                <div className="mt-4 ml-2 md:ml-4 flex items-center gap-6">
                                    <Button
                                        onClick={like}
                                        size="small"
                                        bold={false}
                                        color={post.liked ? "blue" : "white"}
                                    >
                                        <FontAwesomeIcon
                                            icon={faThumbsUp}
                                            className={
                                                post.liked
                                                    ? "text-white"
                                                    : "text-blue-400"
                                            }
                                        />
                                        Like ({post.likes})
                                    </Button>
                                    <span className="text-md text-gray-600">
                                        Comments ({comments.length})
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Comments section */}
                        <div className="flex-grow overflow-y-auto">
                            <CommentSection
                                comments={comments}
                                createComment={createComment}
                                onCommentDelete={onCommentDelete}
                                onCommentUpdate={onCommentUpdate}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
}

export default PostModal;
