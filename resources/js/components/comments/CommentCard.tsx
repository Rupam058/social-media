import { Comment } from "../../model/comment";
import Avatar from "../base/Avatar";

function CommentCard({ comment }: { comment: Comment }) {
    return (
        <div className="flex items-center gap-4">
            <Avatar
                image="http://localhost:8000/storage/avatars/G4Rrilb4ekgy3VT1E7R0YKTIaA9qX21EK7MQFeZ6.png"
                customClass="w-10 h-10"
            />
            <p className="flex-1">{comment.content}</p>
        </div>
    );
}

export default CommentCard;
