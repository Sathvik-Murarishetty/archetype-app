"use client";

import { useState } from "react";
import { motion } from "framer-motion";

type ArchetypeCardProps = {
    title: React.ReactNode;
    description: React.ReactNode;   // ← was string
    onStart?: () => void;
};

export default function ArchetypeCard({ title, description, onStart }: ArchetypeCardProps) {
    const [flipped, setFlipped] = useState(false);

    return (
        <div
            className="relative w-72 h-52 perspective"
            onMouseEnter={() => setFlipped(true)}
            onMouseLeave={() => setFlipped(false)}
        >
            <div className="relative w-full h-full">
                <motion.div
                    animate={{ rotateY: flipped ? 180 : 0 }}
                    transition={{ duration: 0.4 }}
                    className="absolute inset-0 rounded-xl shadow-lg bg-white text-black transform-style preserve-3d"
                    style={{ transformStyle: "preserve-3d" }}
                >
                    {/* Front */}
                    <div className="absolute w-full h-full backface-hidden flex items-center justify-center text-xl font-semibold rounded-xl border border-gray-300">
                        {title}
                    </div>

                    {/* Back */}
                    <div
                        className="absolute w-full h-full backface-hidden flex flex-col items-center justify-center text-center bg-#F4F2F2 text-sm px-4 rounded-xl"
                        style={{ transform: "rotateY(180deg)" }}
                    >
                        <p className="mb-4">{description}</p>
                        {onStart && (
                            <button
                                onClick={onStart}
                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                            >
                                Start
                            </button>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
