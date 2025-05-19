import { useContext, useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { authContext } from "../../context/auth";
import Avatar from "../base/Avatar";
import { APP_BASE_URL, DEFAULT_AVATAR } from "../../bootstarp";
import Button from "../base/Button";

function Navbar() {
    const auth = useContext(authContext);
    const [_, setLocation] = useLocation();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Set loading to false once auth state is determined
        setIsLoading(auth.authenticatedUser === undefined);

        // Debug the auth state
        console.log("Auth state in Navbar:", auth);
        if (auth.authenticatedUser) {
            console.log("User avatar:", auth.authenticatedUser.avatar);
        }
    }, [auth.authenticatedUser]);

    // Construct image URL only if user is authenticated
    const imageUrl = auth.authenticatedUser?.avatar
        ? `${APP_BASE_URL}/storage/avatars/${auth.authenticatedUser.avatar}`
        : DEFAULT_AVATAR;

    return (
        <div className="bg-white py-4 px-2">
            <div className="main-center flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <h2 className="text-xl font-bold text-blue-500">
                        <Link href="/">VibeShare</Link>
                    </h2>
                    <Link href="/">Feed</Link>
                    <Link href="/following">Following</Link>
                </div>
                <div>
                    {auth.authenticatedUser != null ? (
                        <Link
                            to={`/profile/${auth.authenticatedUser.username}`}
                        >
                            <Avatar image={imageUrl} customClass="w-10 h-10" />
                        </Link>
                    ) : (
                        <Button onClick={() => setLocation("/login")}>
                            Log In
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Navbar;
