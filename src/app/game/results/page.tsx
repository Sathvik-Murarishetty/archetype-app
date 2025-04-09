"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const archetypes = [
    { name: "Advancer", description: "Motivated by progress and time-based challenge" },
    { name: "Fixer", description: "Solves problems with precision" },
    { name: "Explorer", description: "Curious, trial-and-error learner" },
    { name: "Preparers", description: "Plans everything in advance" },
    { name: "Flourishers", description: "Loves creativity and patterns" },
    { name: "Vitalizers", description: "Quick, energetic responder" },
    { name: "Hobbyists", description: "Enjoys learning through play" },
];

export default function ResultsPage() {
    const router = useRouter();
    const [times, setTimes] = useState<{ name: string; time: number }[]>([]);
    const [dominant, setDominant] = useState<string | null>(null);

    useEffect(() => {
        const loadedTimes = archetypes.map((arc) => {
            const time = parseFloat(localStorage.getItem(arc.name) || "9999");
            return { name: arc.name, time };
        });

        setTimes(loadedTimes);

        const fastest = loadedTimes.reduce((a, b) => (a.time < b.time ? a : b));
        setDominant(fastest.name);
    }, []);

    return (
        <div className="min-h-screen bg-white px-6 py-10 flex flex-col items-center">
            <h1 className="text-4xl font-bold mb-4">Your Archetype Result</h1>

            {dominant && (
                <div className="text-center mb-10">
                    <h2 className="text-3xl text-blue-700 font-semibold">{dominant}</h2>
                    <p className="text-gray-600 mt-2 max-w-xl">
                        {archetypes.find((a) => a.name === dominant)?.description}
                    </p>
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">
                {times.map(({ name, time }) => {
                    const description = archetypes.find((a) => a.name === name)?.description;
                    return (
                        <div
                            key={name}
                            className="group [perspective:1000px] w-64 h-48 relative"
                        >
                            <div className="relative w-full h-full transition-transform duration-500 transform-style-preserve-3d group-hover:rotate-y-180">
                                {/* Front */}
                                <div className="absolute w-full h-full bg-white border rounded-xl shadow-md flex flex-col items-center justify-center backface-hidden">
                                    <h3 className="text-lg font-bold text-blue-600">{name}</h3>
                                    <p className="text-md text-black mt-2">{time.toFixed(2)}s</p>
                                </div>

                                {/* Back */}
                                <div
                                    className="absolute w-full h-full bg-blue-100 border rounded-xl shadow-md text-center flex flex-col items-center justify-center px-4 backface-hidden"
                                    style={{ transform: "rotateY(180deg)" }}
                                >
                                    <p className="text-sm text-gray-700">{description}</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <button
                onClick={() => router.push("/")}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
            >
                Proceed
            </button>
        </div>
    );
}
