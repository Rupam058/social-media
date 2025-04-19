import { useContext, useEffect, useState } from "react";
import { postService } from "../bootstarp";
import { Post, PostResponse } from "../model/post";
import { authContext } from "../context/auth";
import { APP_BASE_URL } from "../bootstarp";
import PostCard from "../components/PostCard";
import CreatePost from "../components/CreatePost";

function Posts() {
    const [posts, setPosts] = useState<PostResponse[]>([]);
    const auth = useContext(authContext);

    let currentPage = 1;
    let lastPage = 0;
    let fetching = false;

    useEffect(() => {
        renderPosts(1);

        // Adding Event Listener for scroll
        document.addEventListener("wheel", onScroll);
        // checkContentHeight();

        // Cleanup function to remove the event listener
        return () => {
            document.removeEventListener("wheel", onScroll);
        };
    }, []);

    async function onScroll() {
        if (fetching) return;

        if (currentPage == lastPage) return;

        let currentScroll = window.scrollY;
        let maxScrollHeight =
            document.documentElement.scrollHeight - window.innerHeight;

        if (currentScroll / maxScrollHeight > 0.7 || maxScrollHeight <= 0) {
            fetching = true;
            currentPage++;
            await renderPosts(currentPage);

            fetching = false;
        }
    }

    async function renderPosts(page: number) {
        let response = await postService.getPosts(page);
        currentPage = response.current_page;
        lastPage = response.last_page;

        setPosts((p) => [...p, ...response.data]);
    }

    function onPostCreated(post: PostResponse) {
        setPosts([post, ...posts]);
    }

    return (
        <>
            <div className="main-center">
                {auth.authenticatedUser != null ? (
                    <CreatePost onPostCreated={onPostCreated} />
                ) : null}

                <div className="flex flex-col gap-2 mt-2 pb-4">
                    {posts.map((p) => (
                        <PostCard
                            key={p.post.id}
                            post={p.post}
                            liked={p.liked ? p.liked.toString() : null}
                            likes={p.likes}
                            commentCount={p.comments}
                        ></PostCard>
                    ))}
                </div>
            </div>
        </>
    );
}

export default Posts;
