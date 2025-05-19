import { Link } from "wouter";
import { APP_BASE_URL, DEFAULT_AVATAR } from "../../bootstarp";
import { Comment, CommentResponse } from "../../model/comment";
import Avatar from "../base/Avatar";

function CommentCard({ comment }: { comment: CommentResponse }) {
    const imgageUrl = comment.author.avatar
        ? `${APP_BASE_URL}/storage/avatars/${comment.author.avatar}`
        : DEFAULT_AVATAR;

    return (
        <div className="flex items-center gap-4">
            <Avatar image={imgageUrl} customClass="w-10 h-10" />
            <div className="flex-1">
                <Link to={`profile/${comment.author.username}`}>
                    <b className="text-sm">
                        {comment.author.name} (@{comment.author.username})
                    </b>
                </Link>
                <p className={"text-sm"}>{comment.comment.content}</p>
                <p className={"text-xs text-gray-500 mt-2"}>
                    {comment.comment.created_at}
                </p>
            </div>
        </div>
    );
}

export default CommentCard;
