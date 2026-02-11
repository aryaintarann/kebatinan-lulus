"use client";

import { motion } from "framer-motion";

export default function AuroraBackground() {
    return (
        <div className="fixed inset-0 z-0 overflow-hidden bg-black pointer-events-none">
            {/* Darker, subtler gradient base */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(20,20,20,1),rgba(0,0,0,1))]" />

            {/* Monochromatic/Desaturated Orbs for "Cinema" feel */}
            <motion.div
                animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.1, 0.2, 0.1],
                    rotate: [0, 90, 0],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] bg-white/5 rounded-full blur-[120px] mix-blend-screen"
            />

            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.1, 0.2, 0.1],
                    x: [-50, 50, -50],
                }}
                transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-gray-500/10 rounded-full blur-[140px] mix-blend-screen"
            />

            <motion.div
                animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.05, 0.15, 0.05],
                    y: [-50, 50, -50],
                }}
                transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className="absolute top-[40%] left-[30%] w-[50vw] h-[50vw] bg-zinc-800/20 rounded-full blur-[100px] mix-blend-screen"
            />

            {/* Floating Coding Symbols - Speed Increased */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <FloatingSymbol symbol="{ }" top="10%" left="10%" delay={0} duration={6} />
                <FloatingSymbol symbol="</>" top="20%" right="15%" delay={0.5} duration={8} />
                <FloatingSymbol symbol="&&" bottom="15%" left="20%" delay={1} duration={7} />
                <FloatingSymbol symbol="const" top="40%" left="50%" delay={0.2} duration={9} />
                <FloatingSymbol symbol="=>" bottom="30%" right="10%" delay={0.8} duration={8.5} />
                <FloatingSymbol symbol="[]" top="15%" left="60%" delay={1.2} duration={7.5} />
                <FloatingSymbol symbol="||" bottom="10%" left="5%" delay={0.5} duration={8} />
                <FloatingSymbol symbol=";" top="80%" right="40%" delay={1.5} duration={6.5} />
                <FloatingSymbol symbol="return" top="60%" left="5%" delay={0.3} duration={9} />
                <FloatingSymbol symbol="__init__" bottom="5%" right="25%" delay={0.9} duration={8} />

                {/* Additional Symbols for density */}
                <FloatingSymbol symbol="import" top="5%" right="30%" delay={2} duration={9.5} />
                <FloatingSymbol symbol="class" bottom="20%" right="50%" delay={1.1} duration={7} />
                <FloatingSymbol symbol="await" top="50%" right="5%" delay={0.6} duration={8} />
                <FloatingSymbol symbol="div" bottom="40%" left="10%" delay={1.4} duration={9} />
                <FloatingSymbol symbol="0101" top="30%" left="25%" delay={0.2} duration={10} />
                <FloatingSymbol symbol="!=" bottom="5%" left="40%" delay={1.8} duration={7.5} />
                <FloatingSymbol symbol="sudo" top="70%" right="5%" delay={0.8} duration={8.5} />
                <FloatingSymbol symbol="<Bug/>" top="25%" left="5%" delay={2.2} duration={10} />
                <FloatingSymbol symbol="npm" bottom="25%" right="5%" delay={0.2} duration={7.5} />
                <FloatingSymbol symbol="git" top="10%" left="80%" delay={1} duration={9} />
            </div>

            {/* Heavy Grain for Film Look - Reduced opacity to not obscure symbols */}
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.05] mix-blend-overlay pointer-events-none"></div>
            <div className="absolute inset-0 bg-[radial-gradient(transparent,black_80%)] pointer-events-none"></div>
        </div>
    );
}

function FloatingSymbol({ symbol, top, left, right, bottom, delay, duration }: { symbol: string, top?: string, left?: string, right?: string, bottom?: string, delay: number, duration: number }) {
    return (
        <motion.div
            initial={{ y: 0, opacity: 0 }}
            animate={{
                y: [0, -30, 0],
                opacity: [0.4, 1, 0.4], // High visibility, valid CSS opacity
                rotate: [0, 10, -10, 0]
            }}
            transition={{
                duration: duration,
                repeat: Infinity,
                ease: "easeInOut",
                delay: delay,
            }}
            className="absolute text-5xl md:text-7xl font-mono font-bold text-white/20 select-none blur-[0.5px]" // Increased base opacity to white/20 and reduced blur
            style={{ top, left, right, bottom }}
        >
            {symbol}
        </motion.div>
    );
}
