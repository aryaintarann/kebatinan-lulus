"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
    const [percent, setPercent] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setPercent((prev) => {
                if (prev >= 100) {
                    clearInterval(timer);
                    setTimeout(onComplete, 800);
                    return 100;
                }
                // Random increment for more realistic feel
                const increment = Math.floor(Math.random() * 5) + 1;
                return Math.min(prev + increment, 100);
            });
        }, 50);

        return () => clearInterval(timer);
    }, [onComplete]);

    return (
        <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black text-white overflow-hidden"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeInOut" }}
        >
            {/* Background Noise/Gradient */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05),transparent)]" />

            {/* Main Content */}
            <div className="relative z-10 flex flex-col items-center justify-center w-full">

                <div className="overflow-hidden mb-2">
                    <motion.h1
                        initial={{ y: 100 }}
                        animate={{ y: 0 }}
                        transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
                        className="text-6xl md:text-9xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-600"
                    >
                        KEBATINAN
                    </motion.h1>
                </div>

                <div className="overflow-hidden mb-12">
                    <motion.p
                        initial={{ y: 100 }}
                        animate={{ y: 0 }}
                        transition={{ duration: 0.8, delay: 0.1, ease: [0.76, 0, 0.24, 1] }}
                        className="text-xl md:text-2xl font-light tracking-[0.5em] text-gray-400"
                    >
                        CLASS OF 2026
                    </motion.p>
                </div>

                {/* Counter */}
                <div className="absolute bottom-12 right-12">
                    <motion.span
                        className="text-8xl md:text-[10rem] font-bold leading-none text-white/5 font-mono"
                    >
                        {percent}%
                    </motion.span>
                </div>

                {/* Progress Line */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-white/5">
                    <motion.div
                        className="h-full bg-white"
                        initial={{ width: "0%" }}
                        animate={{ width: `${percent}%` }}
                        transition={{ ease: "linear" }}
                    />
                </div>
            </div>
        </motion.div>
    );
}
