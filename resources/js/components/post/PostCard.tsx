import { useContext, useState } from "react";
import {
    APP_BASE_URL,
    commentService,
    likeService,
    postService,
} from "../../bootstarp";
import { Post } from "../../model/post";
import Avatar from "../base/Avatar";
import { authContext } from "../../context/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment, faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import { Like } from "../../model/like";
import { Comment } from "../../model/comment";
import CommentSection from "../comments/CommentSection";

function PostCard({
    post,
    likes,
    liked,
    commentCount,
    onLike,
    onUnlike,
    onComment,
}: {
    post: Post;
    likes: number;
    liked: string | null;
    commentCount: number;
    onLike: (l: Like) => void;
    onUnlike: () => void;
    onComment: (c: Comment[]) => void;
}) {
    const [commentSection, setCommentSection] = useState(false);
    const [comments, setComments] = useState<Comment[]>([]);

    const auth = useContext(authContext);

    async function like() {
        if (liked == null) {
            let like = await likeService.likePost(post.id);
            onLike(like);
        } else {
            await likeService.unlikePost(liked);
            onUnlike();
        }
    }

    async function toggleCommentSection() {
        if (!commentSection) {
            let comments = await postService.getPostComments(post.id);
            setComments(comments);
        }
        setCommentSection(!commentSection);
    }

    async function createComment(content: string) {
        let comments = await commentService.createComment(post.id, content);
        onComment(comments);
        setComments(comments);
    }

    function getLikeButtonColor() {
        return liked != null
            ? "bg-blue-500 text-white hover:bg-blue-600"
            : "hover:bg-gray-100";
    }

    return (
        <div className="bg-white p-2 border rounded-md ">
            <div className="flex items-center gap-4">
                <Avatar image="http://localhost:8000/storage/avatars/G4Rrilb4ekgy3VT1E7R0YKTIaA9qX21EK7MQFeZ6.png" />
                <div>
                    <p className="text-xl">Test Author</p>
                    <p className="text-sm">@authorsomething</p>
                </div>
            </div>
            {/* Post content */}
            {post.image != null ? (
                <img
                    className="h-52 object-cover w-full mt-2"
                    src={`${APP_BASE_URL}/storage/uploads/${post.image}`}
                />
            ) : null}
            <p className="mt-2">{post.caption}</p>

            {auth.authenticatedUser != null ? (
                <>
                    <div className="flex gap-2 items-center mt-4">
                        <button
                            onClick={toggleCommentSection}
                            className="px-2 border rounded-md flex gap-2 items-center hover:bg-gray-100"
                        >
                            <FontAwesomeIcon
                                icon={faComment}
                                className="text-blue-400"
                            />
                            <span className="text-sm">
                                Comment ({commentCount})
                            </span>
                        </button>
                        <button
                            onClick={like}
                            className={`px-2 border rounded-md flex gap-2 items-center ${getLikeButtonColor()}`}
                        >
                            <FontAwesomeIcon
                                icon={faThumbsUp}
                                className="text-blue-400"
                            />
                            <span className="text-sm">Like ({likes})</span>
                        </button>
                    </div>
                </>
            ) : null}
            {/* Comment section */}
            {commentSection ? (
                <CommentSection
                    comments={comments}
                    createComment={createComment}
                />
            ) : null}
        </div>
    );
}
export default PostCard;
