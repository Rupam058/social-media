import { useContext, useState } from "react";
import Button from "../components/base/Button";
import { authContext } from "../context/auth";
import { useLocation } from "wouter";
import EyeToggle from "../components/base/EyeToggle";

function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [_, setLocation] = useLocation();

    const auth = useContext(authContext);

    async function register() {
        if (confirmPassword != password) {
            setError("Password and confirm password do not match");
            return;
        }

        if (!(await auth.register(email, password))) {
            setError("Account with this Email already exists");
        }

        setLocation("/login", {
            state: "Successfully Registered, You can now log In",
        });
    }

    return (
        <div className="main-center">
            <div className="mt-12 border rounded-md bg-white w-full md:w-[30rem] p-6 mx-auto">
                <h2 className="text-2xl font-bold text-center">
                    Register account
                </h2>
                <p className="mt-2 text-center text-red-500">{error}</p>
                <input
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-6 w-full"
                    placeholder="Email"
                    type="email"
                ></input>
                <div className="mt-4 relative">
                    <input
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full"
                        placeholder="Password"
                        type={showPassword ? "text" : "password"}
                    ></input>
                    <EyeToggle
                        showPassword={showPassword}
                        onToggle={() => setShowPassword(!showPassword)}
                    />
                </div>
                <div className="mt-2 relative">
                    <input
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full"
                        placeholder="Confirm Password"
                        type={showConfirmPassword ? "text" : "password"}
                    ></input>
                    <EyeToggle
                        showPassword={showConfirmPassword}
                        onToggle={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                        }
                    />
                </div>
                <Button onClick={register} className="w-full mt-4">
                    Sign Up
                </Button>
            </div>
        </div>
    );
}

export default Register;
