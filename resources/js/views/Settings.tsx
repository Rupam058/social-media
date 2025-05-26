import Button from "../components/base/Button";
import { useContext, useEffect, useState } from "react";
import EyeToggle from "../components/base/EyeToggle";
import { authService } from "../bootstarp";
import { authContext } from "../context/auth";
import { useLocation } from "wouter";

function Settings() {
    const [password, setPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [message, setMessage] = useState("");

    const [showPreviousPassword, setShowPreviousPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);

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

    async function changePassword() {
        if (!(await authService.setPassword(password, newPassword))) {
            setMessage("Incorrect Password");
            return;
        }

        setPassword("");
        setNewPassword("");
        setMessage("Password Changed Successfully");
    }

    async function logout() {
        await auth.logout();
        setLocation("/login");
    }

    return (
        <div className="main-center mt-8 p-4">
            <div className="bg-white p-4 border rounded-md">
                <div className="flex justify-between items-center">
                    <h2 className="text-4xl font-bold">Settings</h2>
                    <Button onClick={logout}>Log Out</Button>
                </div>

                <div className="md:w-1/2 w-full mt-8">
                    <h2 className="mt-8 text-2xl font-bold">Change Password</h2>
                    <p>{message}</p>
                    <div className="mt-4 relative">
                        <input
                            className="w-full"
                            type={showPreviousPassword ? "text" : "password"}
                            placeholder="Previous Password"
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                        />
                        <EyeToggle
                            showPassword={showPreviousPassword}
                            onToggle={() =>
                                setShowPreviousPassword(!showPreviousPassword)
                            }
                        />
                    </div>
                    <div className="mt-2 relative">
                        <input
                            className="w-full"
                            type={showNewPassword ? "text" : "password"}
                            placeholder="New Password"
                            onChange={(e) => setNewPassword(e.target.value)}
                            value={newPassword}
                        />
                        <EyeToggle
                            showPassword={showNewPassword}
                            onToggle={() =>
                                setShowNewPassword(!showNewPassword)
                            }
                        />
                    </div>
                    <Button onClick={changePassword} className="mt-4">
                        Change Password
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default Settings;
