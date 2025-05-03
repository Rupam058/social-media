import { useContext } from "react";
import { Link } from "wouter";
import { authContext } from "../../context/auth";

function Navbar() {
    const auth = useContext(authContext);

    return (
        <div className="bg-white py-4">
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
                        <p>Logged In</p>
                    ) : (
                        <Link className="btn" href="/login">
                            Log In
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Navbar;
