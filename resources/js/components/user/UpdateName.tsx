import { useContext, useEffect, useState } from "react";
import { authContext } from "../../context/auth";
import Button from "../base/Button";
import { userService } from "../../bootstarp";

function UpdateName() {
    const [name, setName] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const auth = useContext(authContext);

    // Pre-fill with current name if available
    useEffect(() => {
        if (auth.authenticatedUser?.name) {
            setName(auth.authenticatedUser.name);
        }
    }, [auth.authenticatedUser]);

    async function changeName() {
        setMessage("");
        setError("");

        if (!name.trim()) {
            setError("Name cannot be empty");
            return;
        }

        try {
            const success = await userService.updateName(name);
            if (success) {
                setMessage("Name updated successfully");
            }
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Failed to update Name");
            }
        }
    }

    return (
        <div className="md:w-1/2 w-full mt-8">
            <h2 className="my-6 text-2xl font-bold">Update Name</h2>
            {message && <p className="text-green-600">{message}</p>}
            {error && <p className="text-red-600">{error}</p>}
            <div className="mt-4">
                <input
                    className="w-full p-2 border rounded"
                    type="text"
                    placeholder="Name"
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                />
                <p className="text-sm text-gray-500 mt-1">
                    Please enter your full name. This will be used for display
                    purposes.
                </p>
            </div>
            <Button onClick={changeName} className="mt-4">
                Update Name
            </Button>
        </div>
    );
}

export default UpdateName;
