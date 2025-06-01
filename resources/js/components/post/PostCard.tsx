import { useContext, useEffect, useState } from "react";
import { PostResponse } from "../../model/post";
import Avatar from "../base/Avatar";
import { authContext } from "../../context/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment, faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import { Like } from "../../model/like";
import { CommentResponse } from "../../model/comment";
import CommentSection from "../comments/CommentSection";
import Button from "../base/Button";
import { Link } from "wouter";
import {
    APP_BASE_URL,
    commentService,
    DEFAULT_AVATAR,
    likeService,
    postService,
} from "../../bootstarp";
import PostModal from "./PostModal";

function PostCard({
    post,
    onLike,
    onUnlike,
    onComment,
}: {
    post: PostResponse;
    onLike: (l: Like) => void;
    onUnlike: () => void;
    onComment: (c: CommentResponse[]) => void;
}) {
    const [commentSection, setCommentSection] = useState(false);
    const [comments, setComments] = useState<CommentResponse[]>([]);
    const [commentCount, setCommentCount] = useState(post.comments);
    const [modalOpen, setModalOpen] = useState(false);

    const auth = useContext(authContext);

    const imageUrl = post.author.avatar
        ? `${APP_BASE_URL}/storage/avatars/${post.author.avatar}`
        : DEFAULT_AVATAR;

    if (!post) {
        return (
            <div className="bg-white p-3 border rounded-md shadow-sm mb-4">
                <p className="text-gray-500">
                    Unable to display this post. Missing data.
                </p>
            </div>
        );
    }

    // Update comment count when post prop changes
    useEffect(() => {
        setCommentCount(post.comments);
    }, [post.comments]);

    // Update comment count when comments array changes
    useEffect(() => {
        if (comments.length > 0) {
            setCommentCount(comments.length);
        }
    }, [comments]);

    async function like() {
        if (post.liked == null) {
            let like = await likeService.likePost(post.post.id);
            onLike(like);
        } else {
            await likeService.unlikePost(post.liked);
            onUnlike();
        }
    }

    async function toggleCommentSection() {
        if (!commentSection) {
            let comments = await postService.getPostComments(post.post.id);
            setComments(comments);
            setCommentCount(comments.length);
        }

        setCommentSection(!commentSection);
    }

    async function createComment(content: string) {
        let comments = await commentService.createComment(
            post.post.id,
            content,
        );
        onComment(comments);
        setComments(comments);
        setCommentCount(comments.length);
    }

    async function openModal() {
        if (comments.length === 0) {
            let fetchedComments = await postService.getPostComments(
                post.post.id,
            );
            setComments(fetchedComments);
            setCommentCount(fetchedComments.length);
        }
        setModalOpen(true);
    }

    function handleCardClick(e: React.MouseEvent) {
        // Don't open modal if clicking on buttons or links
        if (
            !(e.target as HTMLElement).closest("button") &&
            !(e.target as HTMLElement).closest("a")
        ) {
            openModal();
        }
    }

    return (
        <>
            <div
                className="bg-white p-2 border rounded-md cursor-pointer hover:shadow-md transition-shadow"
                onClick={handleCardClick}
            >
                <div className="flex items-center gap-4">
                    <Avatar image={imageUrl} />
                    <div>
                        <p className="text-xl">{post.author.name}</p>
                        <Link
                            className="text-sm text-blue-700"
                            to={`/profile/${post.author.username}`}
                        >
                            @{post.author.username}
                        </Link>
                    </div>
                </div>
                {post.post.image != null ? (
                    <img
                        className="h-52 object-cover w-full mt-2"
                        src={`${APP_BASE_URL}/storage/uploads/${post.post.image}`}
                        alt="Post image"
                    ></img>
                ) : null}

                <p className="mt-2">{post.post.caption}</p>

                {auth.authenticatedUser != null ? (
                    <>
                        <div className="flex gap-2 items-center mt-4">
                            <Button
                                onClick={toggleCommentSection}
                                size="small"
                                bold={false}
                                color="white"
                            >
                                <FontAwesomeIcon
                                    icon={faComment}
                                    className="text-blue-400"
                                />
                                Comment ({commentCount.toLocaleString()})
                            </Button>

                            <Button
                                onClick={like}
                                size="small"
                                bold={false}
                                color={post.liked != null ? "blue" : "white"}
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
                        </div>
                    </>
                ) : null}

                {commentSection ? (
                    <CommentSection
                        comments={comments}
                        createComment={createComment}
                        onCommentDelete={undefined}
                        onCommentUpdate={undefined}
                    />
                ) : null}
            </div>

            <PostModal
                post={post}
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                onLike={onLike}
                onUnlike={onUnlike}
                onComment={onComment}
                comments={comments}
                setComments={setComments}
            />
        </>
    );
}

export default PostCard;
