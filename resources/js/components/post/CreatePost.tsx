import Avatar from "../base/Avatar";
import { Post, PostResponse } from "../../model/post";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faImage,
    faPaperPlane,
    faTimes,
} from "@fortawesome/free-solid-svg-icons";
import UploadImageModal from "./UploadImageModal";
import { useContext, useState } from "react";
import { APP_BASE_URL, DEFAULT_AVATAR, postService } from "../../bootstarp";
import { authContext } from "../../context/auth";
import Button from "../base/Button";

function CreatePost({
    onPostCreated,
}: {
    onPostCreated: (post: PostResponse) => void;
}) {
    const [imageUploadModal, setImageUploadModal] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [caption, setCaption] = useState("");

    const auth = useContext(authContext);

    function onFileClose(file: File | null) {
        setImageUploadModal(false);

        if (file != null) {
            setImageFile(file);
        }
    }

    async function post() {
        let post = await postService.createPost(caption, imageFile);

        setImageFile(null);
        setCaption("");
        onPostCreated(post);
    }

    const imageUrl = auth.authenticatedUser?.avatar
        ? `${APP_BASE_URL}/storage/avatars/${auth.authenticatedUser.avatar}`
        : DEFAULT_AVATAR;

    return (
        <div className="bg-white p-4 border rounded-md flex gap-4">
            <Avatar image={imageUrl} customClass="w-16 h-16" />
            <div className="flex-1">
                <textarea
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    className="bg-gray-100 w-full p-4 h-28 rounded-md"
                    placeholder="What's on your mind?"
                ></textarea>
                <div className="flex justify-between flex-col md:flex-row gap-2 md:gap-0 items-center mt-2">
                    <div className="flex gap-2">
                        <Button
                            color="white"
                            bold={false}
                            size="small"
                            onClick={() => setImageUploadModal(true)}
                        >
                            <FontAwesomeIcon
                                icon={faImage}
                                className="text-blue-400"
                            />
                            {imageFile != null ? imageFile.name : "Add Image"}
                        </Button>
                        {imageFile != null ? (
                            <button>
                                <FontAwesomeIcon
                                    onClick={() => setImageFile(null)}
                                    icon={faTimes}
                                />
                            </button>
                        ) : null}
                    </div>
                    <Button onClick={post}>
                        Post
                        <FontAwesomeIcon icon={faPaperPlane} />
                    </Button>
                </div>
            </div>

            <UploadImageModal open={imageUploadModal} onClose={onFileClose} />
        </div>
    );
}
export default CreatePost;
