import React, { useState } from "react";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useUserLoginMutation } from "@/redux/features/apiSlice";

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const [userLogin, { isLoading }] = useUserLoginMutation();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        mode: "onBlur",
        defaultValues: {
            email: "",
            password: "",
            remember: false,
        },
    });

    const onSubmit = async (data) => {
        try {
            const response = await userLogin({
                email: data.email.trim().toLowerCase(),
                password: data.password,
            }).unwrap();

            toast.success(
                response?.data?.message ||
                response?.message ||
                "Login successful"
            );

            navigate("/");
        } catch (error) {
            console.error("Login failed:", error);

            toast.error(
                error?.data?.message ||
                error?.data?.error ||
                error?.message ||
                "Login failed. Please check your credentials."
            );
        }
    };

    return (
        <div className="min-h-screen bg-[#09090b] text-zinc-100 flex items-center justify-center px-4 py-12 antialiased">
            <div className="w-full max-w-md space-y-8">
                {/* Header section */}
                <div className="text-center space-y-2">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-zinc-100 text-zinc-900 font-semibold text-lg tracking-tight shadow-sm">
                        S
                    </div>

                    <h1 className="text-2xl font-semibold tracking-tight text-zinc-100">
                        Welcome back
                    </h1>

                    <p className="text-sm text-zinc-400 font-normal leading-relaxed">
                        Sign in to access your portfolio dashboard
                    </p>
                </div>

                {/* Card wrapper */}
                <div className="bg-[#121215] border border-zinc-800/80 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-sm">
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-5"
                        noValidate
                    >
                        {/* Email Field */}
                        <div className="space-y-2">
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-zinc-200 leading-none"
                            >
                                Email
                            </label>

                            <div className="relative">
                                <Mail
                                    size={18}
                                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none"
                                />

                                <input
                                    id="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    autoComplete="email"
                                    className={`w-full h-11 bg-[#09090b] border rounded-xl pl-10 pr-4 text-sm text-zinc-100 placeholder:text-zinc-500 outline-none transition-all duration-150 focus:ring-1 ${errors.email
                                        ? "border-red-500/80 focus:border-red-500 focus:ring-red-500"
                                        : "border-zinc-800 focus:border-zinc-500 focus:ring-zinc-500"
                                        }`}
                                    {...register("email", {
                                        required: "Email is required",
                                        pattern: {
                                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                            message: "Please enter a valid email address",
                                        },
                                    })}
                                />
                            </div>

                            {errors.email && (
                                <p className="text-xs font-medium text-red-400 leading-none">
                                    {errors.email.message}
                                </p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label
                                    htmlFor="password"
                                    className="text-sm font-medium text-zinc-200 leading-none"
                                >
                                    Password
                                </label>

                                <button
                                    type="button"
                                    className="text-xs text-zinc-400 hover:text-zinc-200 transition-colors duration-150"
                                    onClick={() => {
                                        toast("Password reset is not available yet.");
                                    }}
                                >
                                    Forgot password?
                                </button>
                            </div>

                            <div className="relative">
                                <Lock
                                    size={18}
                                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none"
                                />

                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    autoComplete="current-password"
                                    className={`w-full h-11 bg-[#09090b] border rounded-xl pl-10 pr-11 text-sm text-zinc-100 placeholder:text-zinc-500 outline-none transition-all duration-150 focus:ring-1 ${errors.password
                                        ? "border-red-500/80 focus:border-red-500 focus:ring-red-500"
                                        : "border-zinc-800 focus:border-zinc-500 focus:ring-zinc-500"
                                        }`}
                                    {...register("password", {
                                        required: "Password is required",
                                        minLength: {
                                            value: 8,
                                            message: "Password must be at least 8 characters",
                                        },
                                    })}
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-200 transition-colors duration-150 focus:outline-none"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>

                            {errors.password && (
                                <p className="text-xs font-medium text-red-400 leading-none">
                                    {errors.password.message}
                                </p>
                            )}
                        </div>

                        {/* Remember Me */}
                        <div className="flex items-center gap-2.5 pt-1">
                            <input
                                id="remember"
                                type="checkbox"
                                className="w-4 h-4 rounded border-zinc-700 bg-zinc-900 text-zinc-100 focus:ring-zinc-500 focus:ring-offset-0 transition"
                                {...register("remember")}
                            />

                            <label
                                htmlFor="remember"
                                className="text-sm text-zinc-400 hover:text-zinc-300 cursor-pointer select-none transition-colors duration-150"
                            >
                                Remember me
                            </label>
                        </div>

                        {/* Submit Action */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-11 rounded-xl bg-zinc-100 text-zinc-900 text-sm font-medium hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] transition-all duration-150 shadow-sm"
                        >
                            {isLoading ? "Signing in..." : "Sign in"}
                        </button>
                    </form>

                    {/* Registration Footer */}
                    <p className="text-center text-sm text-zinc-400 mt-6 font-normal">
                        Don't have an account?{" "}
                        <Link
                            to="/register"
                            className="text-zinc-100 font-medium hover:underline underline-offset-4 transition-all duration-150"
                        >
                            Create account
                        </Link>
                    </p>
                </div>

                {/* Legal / Copyright */}
                <p className="text-center text-xs text-zinc-500 font-normal">
                    © {new Date().getFullYear()} Shohag Miah. All rights reserved.
                </p>
            </div>
        </div>
    );
};

export default Login;