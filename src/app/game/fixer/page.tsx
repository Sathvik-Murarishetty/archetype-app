"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import FlowFreeBoard from "@/components/FlowFreeBoard";

const levelConfigs = [
    {
        blue: [
            { row: 0, col: 3 },
            { row: 1, col: 5 },
        ],
        yellow: [
            { row: 0, col: 5 },
            { row: 2, col: 3 },
        ],
        red: [
            { row: 2, col: 2 },
            { row: 4, col: 4 },
        ],
        green: [
            { row: 1, col: 3 },
            { row: 4, col: 3 },
        ],
    },
    {
        blue: [
            { row: 0, col: 0 },
            { row: 1, col: 1 },
        ],
        red: [
            { row: 0, col: 1 },
            { row: 2, col: 1 },
        ],
        yellow: [
            { row: 2, col: 0 },
            { row: 1, col: 4 },
        ],
        green: [
            { row: 3, col: 1 },
            { row: 5, col: 0 },
        ],
    },
    {
        blue: [
            { row: 0, col: 5 },
            { row: 4, col: 3 },
        ],
        yellow: [
            { row: 2, col: 1 },
            { row: 3, col: 5 },
        ],
        red: [
            { row: 2, col: 2 },
            { row: 4, col: 4 },
        ],
        green: [
            { row: 4, col: 1 },
            { row: 3, col: 3 },
        ],
    },
];

export default function FixerGame() {
    const router = useRouter();
    const [level, setLevel] = useState(0);
    const [startTime, setStartTime] = useState<number | null>(null);
    const [currentTime, setCurrentTime] = useState(0);
    const [showIntro, setShowIntro] = useState(true);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (startTime) {
            timer = setInterval(() => {
                setCurrentTime(Math.floor((Date.now() - startTime) / 1000));
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [startTime]);

    const handleLevelComplete = () => {
        setTimeout(() => {
            if (level < levelConfigs.length - 1) {
                setLevel((prev) => prev + 1);
            } else {
                const totalTime = startTime ? (Date.now() - startTime) / 1000 : 0;
                localStorage.setItem("Fixer", totalTime.toString());
                router.push("/");
            }
        }, 500);
    };

    if (showIntro) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg shadow-lg text-center md:w-[650px]">
                    <h2 className="text-2xl font-bold mb-2 text-black">Fixers</h2>
                    <h3 className="text-lg font-semibold mb-4 text-gray-700">The GlitchHunters</h3>
                    <div className="flex items-start gap-4 mb-4 text-left">
                        <Image src="/fixers.png" alt="emoji" width={90} height={90} />
                        <p className="text-sm text-gray-700">
                            GlitchHunters are problem-seekers and solvers. Their joy lies in decoding chaos,
                            whether it’s fixing broken bikes, websites, or workflows. If something’s off,
                            they notice it first. They’re not here for vibes, they’re here for precision.
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4 text-left">
                        <div>
                            <p className="text-sm font-bold text-black">STRENGTHS</p>
                            <ul className="text-sm text-gray-700 list-disc list-inside">
                                <li>Analytical and resourceful</li>
                                <li>Focused under pressure</li>
                                <li>Excellent with systems and tech</li>
                            </ul>
                        </div>
                        <div>
                            <p className="text-sm font-bold text-black">WEAKNESSES</p>
                            <ul className="text-sm text-gray-700 list-disc list-inside">
                                <li>Gets frustrated with ambiguity or messy learners</li>
                                <li>Can over-engineer simple problems</li>
                                <li>May undervalue emotional/contextual learning</li>
                            </ul>
                        </div>
                    </div>
                    <p className="italic text-sm text-black mb-4">
                        “If it’s broken, it’s just waiting for me.”
                    </p>
                    <button
                        onClick={() => {
                            setShowIntro(false);
                            setStartTime(Date.now());
                        }}
                        className="bg-black text-white px-4 py-2 rounded"
                    >
                        Proceed
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen flex flex-col items-center bg-white px-6 pt-10">
            <div className="w-full max-w-xl mb-4 text-center">
                <p className="text-3xl font-medium text-black">Fixer Archetype</p>
            </div>

            <div className="flex items-center justify-between w-full max-w-xl mb-8">
                <div className="flex-grow bg-gray-200 h-3 rounded-full overflow-hidden mr-4">
                    <div
                        className="bg-blue-600 h-full transition-all duration-300"
                        style={{ width: `${((level + 1) / levelConfigs.length) * 100}%` }}
                    />
                </div>
                <span className="text-gray-700 text-sm font-semibold">{level + 1}/{levelConfigs.length}</span>

                <div className="flex items-center ml-6">
                    <Image src="/timer-icon.png" alt="Timer" width={24} height={24} className="mr-2" />
                    <span className="text-md font-semibold text-black">{currentTime}s</span>
                </div>
            </div>

            <FlowFreeBoard
                key={level}
                gridSize={6}
                colorPairs={Object.entries(levelConfigs[level]).map(([color, [from, to]]) => ({
                    color,
                    from: [from.row, from.col],
                    to: [to.row, to.col],
                }))}
                onComplete={handleLevelComplete}
            />
        </div>
    );
}
