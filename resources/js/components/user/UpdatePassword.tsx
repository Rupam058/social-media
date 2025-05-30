import { useContext, useEffect, useState } from "react";
import { authService } from "../../bootstarp";
import { authContext } from "../../context/auth";
import { useLocation } from "wouter";
import EyeToggle from "../base/EyeToggle";
import Button from "../base/Button";

function UpdatePassword() {
    const [password, setPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const [showPreviousPassword, setShowPreviousPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);

    async function changePassword() {
        if (!(await authService.setPassword(password, newPassword))) {
            setError("Incorrect Password");
            return;
        }

        setPassword("");
        setNewPassword("");
        setMessage("Password Changed Successfully");
    }
    return (
        <div className="md:w-1/2 w-full mt-8">
            <h2 className="my-6 text-2xl font-bold">Change Password</h2>
            {message && <p className="text-green-600">{message}</p>}
            {error && <p className="text-red-600">{error}</p>}
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
                    onToggle={() => setShowNewPassword(!showNewPassword)}
                />
            </div>
            <Button onClick={changePassword} className="mt-4">
                Change Password
            </Button>
        </div>
    );
}

export default UpdatePassword;
