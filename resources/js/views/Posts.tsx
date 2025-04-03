import { useContext, useEffect, useState } from "react";
import { postService } from "../bootstarp";
import { Post } from "../model/post";
import { authContext } from "../context/auth";
import { APP_BASE_URL } from "../bootstarp";

function Posts() {
    const [posts, setPosts] = useState<Post[]>([]);
    const auth = useContext(authContext);

    useEffect(() => {
        load();
    }, []);

    async function load() {
        setPosts((await postService.getPosts()).data);
    }

    async function createPost() {
        await postService.createPost();
    }

    return (
        <>
            <div className="main-center">
                {auth.authenticatedUser != null ? (
                    <button onClick={createPost} className="btn">
                        Create Post
                    </button>
                ) : null}

                {posts.map((p) => (
                    <div key={p.id}>
                        <h2>{p.caption}</h2>
                        {p.image != null ? (
                            <img
                                className="w-96"
                                src={`${APP_BASE_URL}/storage/uploads/${p.image}`}
                            ></img>
                        ) : null}
                    </div>
                ))}
            </div>
        </>
    );
}

export default Posts;
