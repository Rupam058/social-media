import { useContext, useState } from "react";
import { authContext } from "../context/auth";
import Button from "../components/base/Button";

function ResetPassword() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState(
        "Enter You email to send a password reset Link",
    );
    const auth = useContext(authContext);

    async function register() {
        await auth.resetPassword(email);
        setMessage("Sent password reset email!");
    }

    return (
        <div className="main-center">
            <div className="mt-12 border rounded-md bg-white p-6 mx-auto w-full md:w-[30rem]">
                <h2 className="text-2xl font-bold text-center">
                    Reset Password
                </h2>
                <p className="mt-2 text-center">{message}</p>

                <input
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-6"
                    placeholder="Email"
                />
                <Button onClick={register} className="w-full mt-4">
                    Send Reset Mail
                </Button>
            </div>
        </div>
    );
}

export default ResetPassword;
