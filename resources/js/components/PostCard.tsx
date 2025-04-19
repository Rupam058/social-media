import { useContext } from "react";
import { APP_BASE_URL, likeService } from "../bootstarp";
import { Post } from "../model/post";
import Avatar from "./Avatar";
import { authContext } from "../context/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment, faThumbsUp } from "@fortawesome/free-solid-svg-icons";

function PostCard({
    post,
    likes,
    liked,
    commentCount,
}: {
    post: Post;
    likes: number;
    liked: string | null;
    commentCount: number;
}) {
    const auth = useContext(authContext);

    async function like() {
        if (liked == null) {
            await likeService.likePost(post.id);
        } else {
            await likeService.unlikePost(liked);
        }
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
                        <button className="px-2 border rounded-md flex gap-2 items-center hover:bg-gray-100">
                            <FontAwesomeIcon
                                icon={faComment}
                                className="text-blue-400"
                            />
                            <span className="text-sm">Comment</span>
                        </button>
                        <button
                            onClick={like}
                            className="px-2 border rounded-md flex gap-2 items-center hover:bg-gray-100"
                        >
                            <FontAwesomeIcon
                                icon={faThumbsUp}
                                className="text-blue-400"
                            />
                            <span className="text-sm">Like({likes})</span>
                        </button>
                    </div>
                </>
            ) : null}
        </div>
    );
}
export default PostCard;
