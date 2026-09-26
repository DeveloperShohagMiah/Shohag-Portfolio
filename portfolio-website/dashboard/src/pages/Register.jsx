import React, { useState } from "react";
import {
    Eye,
    EyeOff,
    Lock,
    Mail,
    User,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { useUserRegistrationMutation } from "@/redux/features/apiSlice";
import { toast } from "react-hot-toast";

const Register = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const navigate = useNavigate();

    const [userRegistration, { isLoading }] =
        useUserRegistrationMutation();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm({
        mode: "onBlur",
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    const password = watch("password");

    const onSubmit = async (data) => {
        try {
            const response = await userRegistration({
                name: data.name.trim(),
                email: data.email.trim().toLowerCase(),
                password: data.password,
                confirmPassword: data.confirmPassword,
            }).unwrap();

            toast.success(
                response?.data?.message ||
                response?.message ||
                "Registration successful"
            );

            navigate("/login");
        } catch (error) {
            console.error("Registration failed:", error);

            toast.error(
                error?.data?.message ||
                error?.data?.error ||
                error?.message ||
                "Registration failed. Please try again."
            );
        }
    };

    return (
        <div className="min-h-screen bg-[#09090b] text-white flex items-center justify-center px-4 py-10">
            <div className="w-full max-w-md">

                {/* Brand */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white text-black font-bold text-xl mb-4">
                        S
                    </div>

                    <h1 className="text-2xl font-semibold">
                        Create your account
                    </h1>

                    <p className="text-sm text-zinc-500 mt-2">
                        Create an account to manage your portfolio
                    </p>
                </div>

                {/* Card */}
                <div className="bg-[#121215] border border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-xl">

                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-5"
                        noValidate
                    >
                        {/* Name */}
                        <div>
                            <label
                                htmlFor="name"
                                className="block text-sm font-medium text-zinc-300 mb-2"
                            >
                                Full name
                            </label>

                            <div className="relative">
                                <User
                                    size={18}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
                                />

                                <input
                                    id="name"
                                    type="text"
                                    placeholder="Shohag Miah"
                                    autoComplete="name"
                                    className={`w-full h-11 bg-[#09090b] border rounded-xl pl-10 pr-4 text-sm text-white placeholder:text-zinc-600 outline-none transition focus:ring-1 ${errors.name
                                        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                                        : "border-zinc-800 focus:border-zinc-600 focus:ring-zinc-600"
                                        }`}
                                    {...register("name", {
                                        required: "Full name is required",
                                        minLength: {
                                            value: 2,
                                            message:
                                                "Name must be at least 2 characters",
                                        },
                                        maxLength: {
                                            value: 50,
                                            message:
                                                "Name cannot exceed 50 characters",
                                        },
                                    })}
                                />
                            </div>

                            {errors.name && (
                                <p className="text-xs text-red-400 mt-1.5">
                                    {errors.name.message}
                                </p>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-zinc-300 mb-2"
                            >
                                Email
                            </label>

                            <div className="relative">
                                <Mail
                                    size={18}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
                                />

                                <input
                                    id="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    autoComplete="email"
                                    className={`w-full h-11 bg-[#09090b] border rounded-xl pl-10 pr-4 text-sm text-white placeholder:text-zinc-600 outline-none transition focus:ring-1 ${errors.email
                                        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                                        : "border-zinc-800 focus:border-zinc-600 focus:ring-zinc-600"
                                        }`}
                                    {...register("email", {
                                        required: "Email is required",
                                        pattern: {
                                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                            message:
                                                "Please enter a valid email address",
                                        },
                                    })}
                                />
                            </div>

                            {errors.email && (
                                <p className="text-xs text-red-400 mt-1.5">
                                    {errors.email.message}
                                </p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-zinc-300 mb-2"
                            >
                                Password
                            </label>

                            <div className="relative">
                                <Lock
                                    size={18}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
                                />

                                <input
                                    id="password"
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    placeholder="Create a password"
                                    autoComplete="new-password"
                                    className={`w-full h-11 bg-[#09090b] border rounded-xl pl-10 pr-11 text-sm text-white placeholder:text-zinc-600 outline-none transition focus:ring-1 ${errors.password
                                        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                                        : "border-zinc-800 focus:border-zinc-600 focus:ring-zinc-600"
                                        }`}
                                    {...register("password", {
                                        required: "Password is required",
                                        minLength: {
                                            value: 8,
                                            message:
                                                "Password must be at least 8 characters",
                                        },
                                    })}
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(
                                            (prev) => !prev
                                        )
                                    }
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition"
                                    aria-label={
                                        showPassword
                                            ? "Hide password"
                                            : "Show password"
                                    }
                                >
                                    {showPassword ? (
                                        <EyeOff size={18} />
                                    ) : (
                                        <Eye size={18} />
                                    )}
                                </button>
                            </div>

                            {errors.password ? (
                                <p className="text-xs text-red-400 mt-1.5">
                                    {errors.password.message}
                                </p>
                            ) : (
                                <p className="text-xs text-zinc-600 mt-2">
                                    Password must contain at least 8 characters.
                                </p>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label
                                htmlFor="confirmPassword"
                                className="block text-sm font-medium text-zinc-300 mb-2"
                            >
                                Confirm password
                            </label>

                            <div className="relative">
                                <Lock
                                    size={18}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
                                />

                                <input
                                    id="confirmPassword"
                                    type={
                                        showConfirmPassword
                                            ? "text"
                                            : "password"
                                    }
                                    placeholder="Confirm your password"
                                    autoComplete="new-password"
                                    className={`w-full h-11 bg-[#09090b] border rounded-xl pl-10 pr-11 text-sm text-white placeholder:text-zinc-600 outline-none transition focus:ring-1 ${errors.confirmPassword
                                        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                                        : "border-zinc-800 focus:border-zinc-600 focus:ring-zinc-600"
                                        }`}
                                    {...register("confirmPassword", {
                                        required:
                                            "Please confirm your password",
                                        validate: (value) =>
                                            value === password ||
                                            "Passwords do not match",
                                    })}
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowConfirmPassword(
                                            (prev) => !prev
                                        )
                                    }
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition"
                                    aria-label={
                                        showConfirmPassword
                                            ? "Hide password"
                                            : "Show password"
                                    }
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff size={18} />
                                    ) : (
                                        <Eye size={18} />
                                    )}
                                </button>
                            </div>

                            {errors.confirmPassword && (
                                <p className="text-xs text-red-400 mt-1.5">
                                    {errors.confirmPassword.message}
                                </p>
                            )}
                        </div>

                        {/* Terms */}
                        <div>
                            <div className="flex items-start gap-2">
                                <input
                                    id="terms"
                                    type="checkbox"
                                    className="mt-0.5 w-4 h-4 rounded border-zinc-700 bg-zinc-900"
                                />

                                <label
                                    htmlFor="terms"
                                    className="text-xs leading-5 text-zinc-500"
                                >
                                    I agree to the{" "}
                                    <Link
                                        to="/terms"
                                        className="text-white hover:underline"
                                    >
                                        Terms of Service
                                    </Link>{" "}
                                    and{" "}
                                    <Link
                                        to="/privacy"
                                        className="text-white hover:underline"
                                    >
                                        Privacy Policy
                                    </Link>
                                    .
                                </label>
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-11 rounded-xl bg-white text-black text-sm font-medium hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.99] transition"
                        >
                            {isLoading
                                ? "Creating account..."
                                : "Create account"}
                        </button>
                    </form>

                    {/* Login */}
                    <p className="text-center text-sm text-zinc-500 mt-6">
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            className="text-white hover:underline"
                        >
                            Sign in
                        </Link>
                    </p>
                </div>

                <p className="text-center text-xs text-zinc-600 mt-6">
                    © {new Date().getFullYear()} Shohag Miah. All rights reserved.
                </p>
            </div>
        </div>
    );
};

export default Register;