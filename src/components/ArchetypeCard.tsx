"use client";

import { useState } from "react";
import { motion } from "framer-motion";

type ArchetypeCardProps = {
    title: string;
    description: string;
};

export default function ArchetypeCard({ title, description }: ArchetypeCardProps) {
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
                        className="absolute w-full h-full backface-hidden flex flex-col items-center justify-center text-center bg-blue-100 text-sm px-4 rounded-xl"
                        style={{ transform: "rotateY(180deg)" }}
                    >
                        <p>{description}</p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
