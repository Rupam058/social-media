import React, { useContext, useState } from "react";
import { authContext } from "../../context/auth";
import { useLocation } from "wouter";
import Button from "../base/Button";
import Modal from "../base/Modal";

function Logout() {
    const auth = useContext(authContext);
    const [_, setLocation] = useLocation();
    const [showConfirmation, setShowConfirmation] = useState(false);

    async function handleLogout() {
        await auth.logout();
        setLocation("/login");
    }

    function openConfirmation() {
        setShowConfirmation(true);
    }

    function closeConfirmation() {
        setShowConfirmation(false);
    }

    return (
        <>
            <Button color="red" onClick={openConfirmation}>
                Log Out
            </Button>

            <Modal
                open={showConfirmation}
                onClose={closeConfirmation}
            >
                <div className="flex flex-col gap-4">
                    <h2 className="text-xl font-bold text-center">
                        Confirm Logout
                    </h2>
                    <p className="text-center">
                        Are you sure you want to log out?
                    </p>
                    <div className="flex justify-center gap-2 mt-4">
                        <Button color="white" onClick={closeConfirmation}>
                            Cancel
                        </Button>
                        <Button color="red" onClick={handleLogout}>
                            Log Out
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    );
}

export default Logout;
