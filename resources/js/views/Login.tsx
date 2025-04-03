import { ChangeEvent, useContext, useState } from "react";
import { Link, useLocation } from "wouter";
import { authContext } from "../context/auth";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const auth = useContext(authContext);

    const [_, setLocation] = useLocation();

    async function login() {
        let ok = await auth.login(email, password);
        if (!ok) {
            alert("Login Failed");
            return;
        }

        setLocation("/");
    }

    function onEmailChange(e: ChangeEvent<HTMLInputElement>) {
        setEmail(e.target.value);
    }

    function onPasswordChange(e: ChangeEvent<HTMLInputElement>) {
        setPassword(e.target.value);
    }

    return (
        <div className="main-center">
            <div className="mt-8 border border-gray-400 rounded-md bg-white w-[30rem] p-6 mx-auto">
                <h2 className="text-xl font-bold text-center">
                    Log In to VibeShare
                </h2>
                <input
                    className="mt-6"
                    onChange={onEmailChange}
                    type="email"
                    placeholder="Email"
                ></input>
                <input
                    className="mt-2"
                    onChange={onPasswordChange}
                    type="password"
                    placeholder="Password"
                ></input>
                <div className="flex justify-end mt-2">
                    <Link href="/reset-password" className="text-gray-500">
                        Forgot password?
                    </Link>
                </div>
                <button onClick={login} className="btn w-full mt-4">
                    Log In
                </button>
            </div>
        </div>
    );
}

export default Login;
