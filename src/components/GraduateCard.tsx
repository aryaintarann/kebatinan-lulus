"use client";

import Image from "next/image";

import { useState, useRef, MouseEvent, useEffect } from "react";
import { motion, AnimatePresence, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";
import { slugify } from "@/lib/utils";
import { doc, onSnapshot, setDoc, DocumentSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface GraduateCardProps {
    name: string;
    image: string;
    delay: number;
}

export default function GraduateCard({ name, image, delay }: GraduateCardProps) {
    const [isUnlocked, setIsUnlocked] = useState(false);

    // Firestore Realtime Listener
    useEffect(() => {
        const slug = slugify(name);
        const unsub = onSnapshot(doc(db, "graduates", slug), (doc: DocumentSnapshot) => {
            if (doc.exists() && doc.data().isUnlocked) {
                setIsUnlocked(true);
            }
        }, (error: any) => {
            console.error("Firestore access error (check rules):", error);
        });

        // Also check localStorage for immediate feedback/fallback
        const stored = localStorage.getItem(`unlocked_${slug}`);
        if (stored === "true") setIsUnlocked(true);

        return () => unsub();
    }, [name]);

    const [code, setCode] = useState("");
    const [unlockError, setUnlockError] = useState(false); // Renamed from error
    const [imgError, setImgError] = useState(false); // New state for image error
    const [showInput, setShowInput] = useState(false);

    // Hardcoded secret code
    const SECRET_CODE = "LULUS2026";

    // 3D Tilt Logic
    const ref = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const xSpring = useSpring(x);
    const ySpring = useSpring(y);
    const transform = useMotionTemplate`rotateX(${xSpring}deg) rotateY(${ySpring}deg)`;

    const handleMouseMove = (e: MouseEvent) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = (e.clientX - rect.left) * 32.5;
        const mouseY = (e.clientY - rect.top) * 32.5;
        const rX = (mouseY / height - 32.5 / 2) * -1;
        const rY = (mouseX / width - 32.5 / 2);
        x.set(rX);
        y.set(rY);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (code.toUpperCase() === SECRET_CODE) {
            // Optimistic update
            setIsUnlocked(true);
            setUnlockError(false);

            // Save to LocalStorage
            const slug = slugify(name);
            localStorage.setItem(`unlocked_${slug}`, "true");

            // Save to Firestore (Global Unlock)
            try {
                setDoc(doc(db, "graduates", slug), {
                    isUnlocked: true,
                    unlockedAt: new Date().toISOString()
                }, { merge: true });
            } catch (e) {
                console.error("Error unlocking globally:", e);
            }
        } else {
            setUnlockError(true);
            setTimeout(() => setUnlockError(false), 2000);
        }
    };

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ transformStyle: "preserve-3d", transform }}
            className="group relative bg-black/40 backdrop-blur-md border border-white/10 p-8 rounded-xl shadow-2xl flex flex-col items-center hover:border-white/30 transition-colors duration-500 overflow-hidden"
        >
            {/* Spotlight Effect */}
            <div className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100"
                style={{
                    background: `radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(255,255,255,0.05), transparent 40%)`
                }}
            />

            {/* Cinematic Image Frame */}
            <div className="relative w-40 h-40 mb-8 overflow-hidden border border-white/10 shadow-2xl bg-black">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80 z-10" />

                {/* Photo Placeholder / Image */}
                <div className="w-full h-full bg-neutral-900 flex items-center justify-center text-neutral-700 group-hover:scale-105 transition-transform duration-700 relative">
                    {image && !imgError ? (
                        <Image
                            src={image}
                            alt={name}
                            fill
                            unoptimized
                            onError={() => setImgError(true)}
                            className={`object-cover transition-all duration-700 ${isUnlocked ? "grayscale-0" : "grayscale group-hover:grayscale-0"}`}
                        />
                    ) : (
                        <span className="text-4xl">🎓</span>
                    )}
                </div>
            </div>

            <div className="text-center mb-8 min-h-[4rem] flex flex-col justify-center relative z-10 w-full">
                <h2 className="text-xl font-bold flex flex-wrap items-center justify-center gap-1 leading-tight text-white group-hover:text-white transition-colors tracking-tight">
                    <span>{name}</span>
                    <AnimatePresence>
                        {isUnlocked && (
                            <motion.span
                                initial={{ opacity: 0, scale: 0.5, x: -10 }}
                                animate={{ opacity: 1, scale: 1, x: 0 }}
                                className="text-yellow-500 font-serif italic"
                            >
                                , S.Kom
                            </motion.span>
                        )}
                    </AnimatePresence>
                </h2>

                <AnimatePresence>
                    {isUnlocked && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="overflow-hidden"
                        >
                            <p className="text-xs text-gray-400 font-light mt-2 uppercase tracking-[0.2em] border-t border-white/10 pt-2 inline-block">
                                Bachelor of IT
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>

                <p className="text-[10px] text-gray-400 font-mono mt-3 uppercase tracking-widest group-hover:text-white transition-colors">Class of 2026</p>
            </div>

            <div className="w-full relative z-10 mt-auto">
                <AnimatePresence mode="wait">
                    {!isUnlocked && (
                        !showInput ? (
                            <motion.button
                                key="unlock-btn"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                onClick={() => setShowInput(true)}
                                className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-xs font-bold tracking-widest text-gray-400 hover:text-white transition-all group-hover:border-white/20 uppercase"
                            >
                                Unlock Degree
                            </motion.button>
                        ) : (
                            <motion.form
                                key="unlock-form"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                onSubmit={handleSubmit}
                                className="flex flex-col gap-2 relative"
                            >
                                <input
                                    type="text"
                                    placeholder="ENTER CODE"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    className={`w-full px-4 py-3 bg-black/60 border ${unlockError ? "border-red-500/50" : "border-white/10"} rounded-xl text-center text-white text-xs font-mono focus:outline-none focus:border-yellow-500/50 transition-all placeholder:text-gray-700`}
                                    autoFocus
                                    onBlur={() => !code && setShowInput(false)}
                                />
                                {unlockError && (
                                    <p className="text-red-400 text-[10px] text-center absolute -bottom-4 w-full font-mono">ACCESS DENIED</p>
                                )}
                                <button
                                    type="submit"
                                    className="hidden"
                                />
                            </motion.form>
                        )
                    )}
                </AnimatePresence>
            </div>

            {/* Decorative gradient overlay */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-40 h-40 bg-gradient-to-br from-yellow-600/10 to-transparent blur-2xl rounded-full pointer-events-none group-hover:bg-yellow-600/20 transition-colors duration-500"></div>
        </motion.div>
    );
}
