"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { loginUser } from "@/client/services/authorization/auth";
import { useSnackbar } from "@/client/shared/hooks/useSnackbar";
import Snackbar from "@/client/shared/components/Snackbar";


export default function LoginForm() {
    const [error, setError] = useState("");
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const {
        snackbar,
        snackbarError,
        hideSnackbar,
    } = useSnackbar();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!identifier.trim() || !password.trim()) {
            setError("Please fill in all fields");
            return;
        }

        setError("");
        setLoading(true);

        try {
            const result = await loginUser(identifier.trim(), password);

            if (result.success && result.token) {
                router.push("/dashboard");
            } else if (result.error === 401) {
                setError("Invalid username or password!");
            } else {
                snackbarError("An unexpected error occurred. Please try again.");
            }
        } catch {
            snackbarError("An unexpected error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="min-h-screen flex items-center relative overflow-hidden px-6 md:px-20"
            style={{
                backgroundColor: "#f6f3fa",
                backgroundImage: [
                    "radial-gradient(circle, rgba(75,44,130,0.07) 1px, transparent 1px)",
                    "linear-gradient(90deg, rgba(142,91,196,0.55) 0%, transparent 20%, transparent 80%, rgba(255,201,60,0.55) 100%)",
                    "linear-gradient(180deg, rgba(229,0,125,0.30) 0%, transparent 22%, transparent 78%, rgba(243,146,0,0.35) 100%)",
                ].join(", "),
                backgroundSize: "18px 18px, cover, cover",
            }}
        >
            <div className="relative z-10 w-full flex items-center justify-between gap-16 max-w-6xl mx-auto">
                {/* Logo Orisha */}
                <div className="hidden md:flex flex-col items-end select-none">
                    <div className="relative">
                        {/* Triangle en trame dégradée derrière "IS" */}
                        <div
                            aria-hidden="true"
                            className="absolute top-1/2 -translate-y-1/2"
                            style={{
                                left: "38%",
                                width: "5.5rem",
                                height: "10rem",
                                background: "linear-gradient(180deg, #ffc93c 0%, #e5007d 50%, #ffc93c 100%)",
                                clipPath: "polygon(0 0, 100% 50%, 0 100%)",
                                WebkitMaskImage: "radial-gradient(circle, #000 1.3px, transparent 1.6px)",
                                maskImage: "radial-gradient(circle, #000 1.3px, transparent 1.6px)",
                                WebkitMaskSize: "6px 6px",
                                maskSize: "6px 6px",
                            }}
                        />
                        <span
                            className="relative text-8xl font-bold tracking-wider"
                            style={{ color: "#4b2c82", letterSpacing: "0.06em" }}
                        >
                    ORISHA
                </span>
                    </div>
                    <span className="text-3xl font-normal -mt-1" style={{ color: "#4b2c82" }}>
                Commerce
            </span>
                </div>

                {/* Login card */}
                <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-8 border border-[#4b2c82]/10">
                    {/* Logo compact sur mobile */}
                    <div className="md:hidden mb-6 text-center">
                <span className="text-4xl font-bold tracking-wider" style={{ color: "#4b2c82" }}>
                    ORISHA
                </span>
                        <span className="block text-sm" style={{ color: "#4b2c82" }}>Commerce</span>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {error && (
                            <div className="rounded-lg p-3 text-sm flex items-center gap-2 bg-red-50 border border-red-200 text-red-600">
                                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {error}
                            </div>
                        )}

                        <div>
                            <label htmlFor="identifier" className="mb-2 block text-sm font-medium text-[#4b2c82]/70">
                                Email
                            </label>
                            <input
                                type="text"
                                id="identifier"
                                value={identifier}
                                onChange={(e) => setIdentifier(e.target.value)}
                                placeholder="Enter your email"
                                className="w-full rounded-md px-3 py-2.5 text-sm text-gray-800 border border-gray-300 outline-none transition-colors focus:border-[#4b2c82] focus:ring-1 focus:ring-[#4b2c82] placeholder:text-gray-400"
                                autoComplete="username"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="mb-2 block text-sm font-medium text-[#4b2c82]/70">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                className="w-full rounded-md px-3 py-2.5 text-sm text-gray-800 border border-gray-300 outline-none transition-colors focus:border-[#4b2c82] focus:ring-1 focus:ring-[#4b2c82] placeholder:text-gray-400"
                                autoComplete="current-password"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-md px-4 py-3 text-sm font-bold uppercase tracking-wide text-white shadow-md transition-all hover:brightness-110 hover:shadow-lg disabled:opacity-60"
                            style={{ background: "linear-gradient(90deg, #4b2c82 0%, #e5007d 100%)" }}
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                            <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor"
                                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Connexion...
                        </span>
                            ) : (
                                "Connexion"
                            )}
                        </button>
                    </form>
                </div>
            </div>

            <Snackbar
                message={snackbar.message}
                type={snackbar.type}
                isVisible={snackbar.isVisible}
                onClose={hideSnackbar}
            />
        </div>
    );
}