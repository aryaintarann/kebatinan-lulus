"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function SecretReveal() {
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [code, setCode] = useState("");
    const [error, setError] = useState(false);

    // Hardcoded secret code for demonstration
    const SECRET_CODE = "LULUS2026";

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (code.toUpperCase() === SECRET_CODE) {
            setIsUnlocked(true);
            setError(false);
        } else {
            setError(true);
            setTimeout(() => setError(false), 2000);
        }
    };

    return (
        <div className="mt-6 flex flex-col items-center justify-center">
            <AnimatePresence mode="wait">
                {!isUnlocked ? (
                    <motion.form
                        key="lock-form"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        onSubmit={handleSubmit}
                        className="flex flex-col items-center gap-4"
                    >
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Enter Secret Code"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                className={`px-4 py-2 rounded-lg bg-white/10 border ${error ? "border-red-500" : "border-white/20"
                                    } text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500 transition-all text-center tracking-widest`}
                            />
                            {error && (
                                <motion.span
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="absolute -bottom-6 left-0 right-0 text-red-500 text-xs text-center"
                                >
                                    Incorrect Code
                                </motion.span>
                            )}
                        </div>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-yellow-600 hover:bg-yellow-500 text-black font-bold rounded-full transition-colors"
                        >
                            Unlock Degree
                        </button>
                        <p className="text-xs text-gray-500 mt-2">Hint: LULUS2026</p>
                    </motion.form>
                ) : (
                    <motion.div
                        key="degree-reveal"
                        initial={{ opacity: 0, scale: 0.5, rotateX: 90 }}
                        animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                        transition={{ type: "spring", bounce: 0.5 }}
                        className="text-center"
                    >
                        <h2 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-600 drop-shadow-lg">
                            S.Kom
                        </h2>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="text-gray-300 mt-4 text-lg"
                        >
                            Sarjana Komputer
                        </motion.p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
