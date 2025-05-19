import { Link } from "wouter";
import { APP_BASE_URL, DEFAULT_AVATAR } from "../../bootstarp";
import { UserMeta } from "../../model/user";
import Avatar from "../base/Avatar";
import Button from "../base/Button";

function FollowingCard({
    user,
    onUnfollow,
}: {
    user: UserMeta;
    onUnfollow: () => void;
}) {
    const imageUrl = user.avatar
        ? `${APP_BASE_URL}/storage/avatars/${user.avatar}`
        : DEFAULT_AVATAR;

    return (
        <div className="bg-white p-4 border rounded-md w-72 flex-col flex items-center">
            <div className="flex justify-center">
                <Avatar image={imageUrl} customClass="w-32 h-32" />
            </div>
            <div>
                <Link
                    to={`profile/${user.username}`}
                    className={`text-xl mt-4 text-blue-500`}
                >
                    {user.name}
                </Link>
                <p className="text-sm text-gray-500">@{user.username}</p>
            </div>

            <Button className="mt-4" onClick={onUnfollow}>
                Unfollow
            </Button>
        </div>
    );
}

export default FollowingCard;
