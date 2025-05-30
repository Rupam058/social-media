import { useContext, useEffect, useState } from "react";
import { authContext } from "../../context/auth";
import Button from "../base/Button";
import { userService } from "../../bootstarp";
import { useLocation } from "wouter";
import Modal from "../base/Modal";

function UpdateUsername() {
    const [username, setUsername] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const auth = useContext(authContext);
    const [_, setLocation] = useLocation();
    const [showConfirmation, setShowConfirmation] = useState(false);

    function openConfirmation() {
        setShowConfirmation(true);
    }

    function closeConfirmation() {
        setShowConfirmation(false);
    }

    // Pre-fill with current username if available
    useEffect(() => {
        if (auth.authenticatedUser?.username) {
            setUsername(auth.authenticatedUser.username);
        }
    }, [auth.authenticatedUser]);

    async function changeUsername() {
        setMessage("");
        setError("");

        if (!username.trim()) {
            setError("Username cannot be empty");
            return;
        }

        try {
            const success = await userService.updateUsername(username);
            if (success) {
                setMessage("Username updated successfully");

                setLocation("/login", {
                    state: "After changing the username, you need to log in again.",
                });
            }
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Failed to update username");
            }
        }
    }

    return (
        <div className="md:w-1/2 w-full mt-8">
            <h2 className="my-6 text-2xl font-bold">Update Username</h2>
            {message && <p className="text-green-600">{message}</p>}
            {error && <p className="text-red-600">{error}</p>}
            <div className="mt-4">
                <input
                    className="w-full p-2 border rounded"
                    type="text"
                    placeholder="Username"
                    onChange={(e) => setUsername(e.target.value)}
                    value={username}
                />
                <p className="text-sm text-gray-500 mt-1">
                    Only letters and numbers are allowed. Special characters
                    will be removed.
                </p>
            </div>
            <Button onClick={openConfirmation} className="mt-4">
                Update Username
            </Button>

            <Modal open={showConfirmation} onClose={closeConfirmation}>
                <div className="flex flex-col gap-4">
                    <h2 className="text-xl font-bold text-center">
                        Confirm Action
                    </h2>
                    <p className="text-center">
                        Are you sure you want to change the Username?
                        <br />
                        <span className="text-center text-sm text-red-600">
                            After changing the username, you will need to log in
                            again.
                        </span>
                    </p>
                    <div className="flex justify-center gap-2 mt-4">
                        <Button color="white" onClick={closeConfirmation}>
                            Cancel
                        </Button>
                        <Button color="red" onClick={changeUsername}>
                            Yes
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}

export default UpdateUsername;
