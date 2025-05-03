import Avatar from "../base/Avatar";
import { Post, PostResponse } from "../../model/post";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faImage,
    faPaperPlane,
    faTimes,
} from "@fortawesome/free-solid-svg-icons";
import UploadImageModal from "./UploadImageModal";
import { useState } from "react";
import { postService } from "../../bootstarp";

function CreatePost({
    onPostCreated,
}: {
    onPostCreated: (post: PostResponse) => void;
}) {
    const [imageUploadModal, setImageUploadModal] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [caption, setCaption] = useState("");

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

    return (
        <div className="bg-white p-4 border rounded-md flex gap-4">
            <Avatar
                image="http://localhost:8000/storage/avatars/G4Rrilb4ekgy3VT1E7R0YKTIaA9qX21EK7MQFeZ6.png"
                customClass="w-16 h-16"
            />
            <div className="flex-1">
                <textarea
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    className="bg-gray-100 w-full p-4 h-28 rounded-md"
                    placeholder="What's on your mind?"
                ></textarea>
                <div className="flex justify-between items-center mt-2">
                    <div className="flex gap-2">
                        <button
                            className="px-2 border rounded-md flex gap-2 items-center hover:bg-gray-100"
                            onClick={() => setImageUploadModal(true)}
                        >
                            <FontAwesomeIcon
                                icon={faImage}
                                className="text-blue-400"
                            />
                            {imageFile != null ? imageFile.name : "Add Image"}
                        </button>
                        {imageFile != null ? (
                            <button>
                                <FontAwesomeIcon
                                    onClick={() => setImageFile(null)}
                                    icon={faTimes}
                                />
                            </button>
                        ) : null}
                    </div>
                    <button
                        onClick={post}
                        className="btn flex items-center gap-2"
                    >
                        Post
                        <FontAwesomeIcon icon={faPaperPlane} />
                    </button>
                </div>
            </div>

            <UploadImageModal open={imageUploadModal} onClose={onFileClose} />
        </div>
    );
}
export default CreatePost;
