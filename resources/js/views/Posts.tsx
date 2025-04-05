import { useContext, useEffect, useState } from "react";
import { postService } from "../bootstarp";
import { Post } from "../model/post";
import { authContext } from "../context/auth";
import { APP_BASE_URL } from "../bootstarp";
import PostCard from "../components/PostCard";

function Posts() {
    const [posts, setPosts] = useState<Post[]>([]);
    const auth = useContext(authContext);

    useEffect(() => {
        load();

        // Adding Event Listener for scroll
        document.addEventListener("wheel", onScroll);

        // Cleanup function to remove the event listener
        return () => {
            document.removeEventListener("wheel", onScroll);
        };
    }, []);

    function onScroll() {
        
    }

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

                <div className="flex flex-col gap-2 mt-2 pb-4">
                    {posts.map((p) => (
                        <PostCard key={p.id} post={p}></PostCard>
                    ))}
                </div>
            </div>
        </>
    );
}

export default Posts;
