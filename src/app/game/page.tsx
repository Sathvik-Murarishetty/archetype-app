"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ArchetypeCard from "../../components/ArchetypeCard";
import Image from "next/image";
import Confetti from 'react-confetti';

const archetypes = [
    { title: "Advancer", description: "Motivated by progress and time-based challenge" },
    { title: "Fixer", description: "Solves problems with precision" },
    { title: "Explorer", description: "Curious, trial-and-error learner" },
    { title: "Preparers", description: "Plans everything in advance" },
    { title: "Flourishers", description: "Loves creativity and patterns" },
    { title: "Vitalizers", description: "Quick, energetic responder" },
    { title: "Hobbyists", description: "Enjoys learning through play" },
];

export default function Home() {
    const router = useRouter();
    const [times, setTimes] = useState<Record<string, string>>({});
    const [fastest, setFastest] = useState<string | null>(null);
    const [subdominant, setSubdominant] = useState<string | null>(null);

    useEffect(() => {
        const loaded: Record<string, string> = {};
        const completed: { title: string; time: number }[] = [];

        archetypes.forEach(({ title }) => {
            const time = localStorage.getItem(title);
            if (time) {
                const parsed = parseFloat(time);
                loaded[title] = `${parsed.toFixed(2)} sec`;
                completed.push({ title, time: parsed });
            } else {
                loaded[title] = "-- sec";
            }
        });

        setTimes(loaded);

        if (completed.length === archetypes.length) {
            completed.sort((a, b) => a.time - b.time);
            setFastest(completed[0].title);
            setSubdominant(completed[1]?.title || null);
        }
    }, []);

    const handleStart = (title: string) => {
        router.push(`/game/${title.toLowerCase()}`);
    };

    const handleReset = () => {
        archetypes.forEach(({ title }) => localStorage.removeItem(title));
        window.location.reload();
    };

    return (
        <main className="min-h-screen flex flex-col items-center justify-center p-10 bg-white">
            <h1 className="text-4xl font-bold mb-10 text-black">7 Learning Archetypes</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {archetypes.slice(0, 4).map((arc) => {
                    const isCompleted = times[arc.title] !== "-- sec";
                    const isFastest = arc.title === fastest;
                    return (
                        <div key={arc.title} className={isCompleted ? "opacity-50" : "bg-white text-white rounded-xl"}>
                            <ArchetypeCard
                                title={
                                    <div className="flex flex-col items-center">
                                        <div
                                            className="text-xl font-semibold"
                                            style={{ color: isFastest ? "green" : isCompleted ? "#000000" : undefined }}
                                        >
                                            {arc.title}
                                        </div>
                                        <div className="flex items-center gap-2 text-sm mt-1">
                                            <Image src="/timer-icon.png" alt="timer" width={16} height={16} />
                                            <span>{times[arc.title]}</span>
                                        </div>
                                    </div>
                                }
                                description={arc.description}
                                onStart={isCompleted ? undefined : () => handleStart(arc.title)}
                            />
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
                {archetypes.slice(4).map((arc) => {
                    const isCompleted = times[arc.title] !== "-- sec";
                    const isFastest = arc.title === fastest;
                    return (
                        <div key={arc.title} className={isCompleted ? "opacity-50" : "bg-white text-white rounded-xl"}>
                            <ArchetypeCard
                                title={
                                    <div className="flex flex-col items-center">
                                        <div
                                            className="text-xl font-semibold"
                                            style={{ color: isFastest ? "green" : isCompleted ? "#000000" : undefined }}
                                        >
                                            {arc.title}
                                        </div>
                                        <div className="flex items-center gap-2 text-sm mt-1">
                                            <Image src="/timer-icon.png" alt="timer" width={16} height={16} />
                                            <span>{times[arc.title]}</span>
                                        </div>
                                    </div>
                                }
                                description={arc.description}
                                onStart={isCompleted ? undefined : () => handleStart(arc.title)}
                            />
                        </div>
                    );
                })}
            </div>

            {Object.values(times).every(t => t !== "-- sec") && (
                <button
                    onClick={handleReset}
                    className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition"
                >
                    Reset All
                </button>
            )}

            {fastest && <Confetti recycle={false} numberOfPieces={400} />}

            {fastest && (
                <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-white shadow-lg rounded-xl px-10 py-6 text-center scale-150 border border-green-500">
                    <h2 className="text-2xl font-bold text-green-600 mb-2">Your Archetype</h2>
                    <p className="text-lg font-semibold text-black mb-2">{fastest}</p>
                    {subdominant && (
                        <p className="text-sm text-gray-700 mb-4">
                            Your sub-dominant archetype is <span className="font-semibold text-black">{subdominant}</span>
                        </p>
                    )}
                    <button
                        onClick={() => router.push(`/game/bingo/${fastest.toLowerCase()}`)}
                        className="mt-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                        Proceed to Your BingoCard
                    </button>
                </div>
            )}
        </main>
    );
}