"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, Variants } from "framer-motion";
import GraduateCard from "@/components/GraduateCard";
import AuroraBackground from "@/components/AuroraBackground";

import { slugify } from "@/lib/utils";

import { GRADUATES } from "@/lib/constants";

const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

const getGraduateImage = (name: string) => {
    if (!CLOUDINARY_CLOUD_NAME) return "";
    return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/v1/graduates/${slugify(name)}`;
};

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.3,
        },
    },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: "easeOut" as const // Fix for ease type compatibility
        }
    },
};

export default function MainContent() {
    const containerRef = useRef(null);

    return (
        <div ref={containerRef} className="relative min-h-[150vh] pb-32 overflow-hidden">
            <AuroraBackground />

            <div className="relative z-10 container mx-auto px-4 pt-32">

                {/* Header Section */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                    className="text-center mb-32 relative z-20"
                >
                    <motion.div variants={itemVariants} className="mb-6 flex justify-center">
                        <div className="h-px w-24 bg-gradient-to-r from-transparent via-white/50 to-transparent" />
                    </motion.div>

                    <motion.h1
                        variants={itemVariants}
                        className="text-6xl md:text-9xl font-black mb-6 tracking-tighter leading-none text-transparent bg-clip-text bg-gradient-to-b from-white via-gray-200 to-gray-600 drop-shadow-2xl"
                    >
                        KEBATINAN
                        <br />
                        <span className="text-4xl md:text-7xl">SUDAH SARJANA</span>
                    </motion.h1>

                    <motion.div variants={itemVariants} className="space-y-4">
                        <p className="text-lg md:text-xl text-gray-400 font-light tracking-[0.5em] uppercase border-y border-white/5 py-4 inline-block px-12 backdrop-blur-sm">
                            ITB STIKOM BALI 2026
                        </p>
                    </motion.div>
                </motion.div>

                {/* Graduates Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 pb-20 max-w-7xl mx-auto"
                >
                    {GRADUATES.map((name, index) => (
                        <motion.div key={index} variants={itemVariants}>
                            <GraduateCard
                                name={name}
                                image={getGraduateImage(name)}
                                delay={index}
                            />
                        </motion.div>
                    ))}
                </motion.div>

            </div>
        </div>
    );
}
