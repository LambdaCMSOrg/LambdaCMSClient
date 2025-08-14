import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {login} from "../../common/ApiService";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const result = await login(email, password);

        if (!result.success) {
            alert("Login failed!");
            return;
        }

        navigate("/");
    };

    return (
        <div className="flex items-center justify-center h-screen bg-white px-4 w-full">
            <div className="flex items-center justify-center h-screen bg-white px-4">
                <div className="max-w-md mx-auto w-full space-y-6">
                    {/* Logo + Titel */}
                    <div className="text-center mb-6">
                        <div className="flex items-center justify-center gap-2">
                            <div className="w-10 h-10 bg-[#09797A] rounded-full"></div>
                            {/* Platzhalter-Logo */}
                            <h1 className="text-2xl font-bold text-[#09797A]">
                                Lambda <span className="text-[#A2D8B3]">CMS</span>
                            </h1>
                        </div>
                        <div className="mt-6 text-gray-400 text-sm flex items-center justify-center">
                            <div className="w-1/5 border-t border-gray-300"/>
                            <span className="mx-3">Sign in with email</span>
                            <div className="w-1/5 border-t border-gray-300"/>
                        </div>
                    </div>

                    {/* Formular */}
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Example@gmail.com"
                                className="w-full px-4 py-2 border border-[#09797A] rounded-md focus:outline-none focus:ring-2 focus:ring-[#09797A]"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <div className="relative">
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#09797A]"
                                    required
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-700"
                                >

                                </button>
                            </div>
                            <div className="text-right mt-1">
                                <a href="#" className="text-sm text-gray-400 hover:underline">Forgot my password?</a>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-[#09797A] text-white py-2 rounded-md hover:scale-[1.02] transition-transform"
                        >
                            Sign in
                        </button>
                    </form>

                    {/* Footer */}
                    <p className="text-center text-sm text-gray-400">
                        Don’t have an account yet?{" "}
                        <a href="#" className="text-[#09797A] hover:underline">Create an account</a>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;