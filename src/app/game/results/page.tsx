"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ArchetypeFlipCard from "@/components/ArchetypeFlipCard";

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
            <h1 className="text-4xl font-bold mb-4 text-black">Your Archetype Result</h1>

            {dominant && (
                <div className="text-center mb-10">
                    <h2 className="text-3xl text-blue-700 font-semibold">{dominant}</h2>
                    <p className="text-gray-600 mt-2 max-w-xl">
                        {archetypes.find((a) => a.name === dominant)?.description}
                    </p>
                </div>
            )}

            {/* First Row (4 Cards) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                {times.slice(0, 4).map(({ name, time }) => {
                    const description = archetypes.find((a) => a.name === name)?.description || "";
                    return (
                        <ArchetypeFlipCard
                            key={name}
                            name={name}
                            time={time}
                            description={description}
                        />
                    );
                })}
            </div>

            {/* Second Row (3 Cards) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
                {times.slice(4).map(({ name, time }) => {
                    const description = archetypes.find((a) => a.name === name)?.description || "";
                    return (
                        <ArchetypeFlipCard
                            key={name}
                            name={name}
                            time={time}
                            description={description}
                        />
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
