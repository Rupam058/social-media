import { useContext, useState } from "react";
import { Comment } from "../model/comment";
import { authContext } from "../context/auth";
import Avatar from "./Avatar";
import { APP_BASE_URL } from "../bootstarp";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import CommentCard from "./CommentCard";

function CommentSection({
    comments,
    createComment,
}: {
    comments: Comment[];
    createComment: (c: string) => void;
}) {
    const auth = useContext(authContext);
    const [content, setContent] = useState("");

    function create() {
        createComment(content);
        setContent("");
    }

    return (
        <div className="p-4">
            {auth.authenticatedUser != null ? (
                <div className="flex items-center gap-4">
                    <Avatar
                        image={`http://localhost:8000/storage/avatars/G4Rrilb4ekgy3VT1E7R0YKTIaA9qX21EK7MQFeZ6.png`}
                        customClass="w-10 h-10"
                    />
                    <input
                        type="text"
                        placeholder="Write a comment..."
                        className="border rounded-md flex-1 p-2"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                    <button
                        className="bg-blue-500 p-3 text-white rounded-md hover:bg-blue-600"
                        onClick={create}
                    >
                        <FontAwesomeIcon icon={faPaperPlane} />
                    </button>
                </div>
            ) : null}

            <div className="flex flex-col gap-2 mt-4">
                {comments.map((c) => (
                    <CommentCard key={c.id} comment={c} />
                ))}
            </div>
        </div>
    );
}

export default CommentSection;
