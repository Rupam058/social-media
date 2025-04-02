import { useEffect, useState } from "react";

interface Post {
    id: string;
    caption: string;
    image: string | null;
}

function Posts() {
    const API_BASE_URL = "http://localhost:8000";
    const [posts, setPosts] = useState<Post[]>([]);

    useEffect(() => {
        load();
    }, []);

    async function getCsrfResponse() {
        try {
            const csrfResponse = await fetch(
                `${API_BASE_URL}/sanctum/csrf-cookie`,
                {
                    method: "GET",
                    credentials: "include",
                    headers: {
                        Accept: "application/json",
                    },
                },
            );

            console.log("CSRF Response", csrfResponse);
        } catch (error) {
            console.log("error:", error);
        }
    }

    async function load() {
        await getCsrfResponse();

        const registerResponse = await fetch(`${API_BASE_URL}/api/posts`, {
            method: "GET",
            credentials: "include",
        });
        const posts = await registerResponse.json();

        setPosts(posts.data);
    }

    return (
        <>
            {posts.map((p) => (
                <div key={p.id}>
                    <h2>{p.caption}</h2>
                    {p.image != null ? (
                        <img
                            className="w-96"
                            src={`${API_BASE_URL}/storage/uploads/${p.image}`}
                        ></img>
                    ) : null}
                </div>
            ))}
        </>
    );
}

export default Posts;
