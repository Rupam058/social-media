import { ChangeEvent, useContext, useState } from "react";
import { Link, useLocation } from "wouter";
import { authContext } from "../context/auth";
import Button from "../components/base/Button";
import SignInWithGoogle from "../components/base/SignInWithGoogle";
import EyeToggle from "../components/base/EyeToggle";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
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

    function signInWithGoogle() {
        window.location.href = "/auth/redirect/google";
    }

    return (
        <div className="main-center">
            <div className="mt-8 border border-gray-400 rounded-md bg-white w-full md:w-[30rem] p-6 mx-auto">
                <h2 className="text-xl font-bold text-center">
                    Log In to VibeShare
                </h2>
                <p className="text-center">{history.state}</p>
                <input
                    className="mt-6 w-full"
                    onChange={onEmailChange}
                    type="email"
                    placeholder="Email"
                ></input>
                <div className="mt-2 relative">
                    <input
                        className="w-full"
                        onChange={onPasswordChange}
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                    ></input>
                    <EyeToggle
                        showPassword={showPassword}
                        onToggle={() => setShowPassword(!showPassword)}
                    />
                </div>
                <div className="flex justify-end mt-2">
                    <Link href="/reset-password" className="text-gray-500">
                        Forgot password?
                    </Link>
                </div>
                <Button onClick={login} className="w-full mt-4">
                    Log In
                </Button>
                <SignInWithGoogle
                    className="w-full mt-2"
                    onClick={signInWithGoogle}
                />

                {/* Divider */}
                <div className="flex items-center my-6">
                    <div className="flex-grow border-t border-gray-300"></div>
                    <span className="px-3 text-sm text-gray-800">OR</span>
                    <div className="flex-grow border-t border-gray-300"></div>
                </div>

                {/* Register button for new users */}
                <div className="mt-6 text-center">
                    <p className="text-gray-600">
                        New user?
                        <Link
                            href="/register"
                            className="ml-1 text-blue-600 hover:underline"
                        >
                            Register here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;
