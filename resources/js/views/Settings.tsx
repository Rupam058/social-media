import UpdatePassword from "../components/user/UpdatePassword";
import Logout from "../components/profile/Logout";
import UpdateUsername from "../components/user/UpdateUsername";
import { useContext, useEffect } from "react";
import { authContext } from "../context/auth";
import { useLocation } from "wouter";
import UpdateName from "../components/user/UpdateName";

function Settings() {
    const auth = useContext(authContext);
    const [_, setLocation] = useLocation();

    useEffect(() => {
        if (!auth.loaded || auth.authenticatedUser != null) {
            return;
        }

        setLocation("/login", {
            state: "You need to log in to access this page",
        });
    }, [auth.authenticatedUser]);

    return (
        <div className="main-center mt-8 p-4">
            <div className="bg-white p-4 border rounded-md">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-4xl font-bold">Settings</h2>
                    <Logout />
                </div>
                <hr className="my-8 border-t border-gray-600" />
                <UpdatePassword />
                <hr className="my-8 border-t border-gray-600" />
                <UpdateUsername />
                <hr className="my-8 border-t border-gray-600" />
                <UpdateName />
            </div>
        </div>
    );
}

export default Settings;
