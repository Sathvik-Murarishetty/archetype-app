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
];

export default function FixerGame() {
    const router = useRouter();
    const [level, setLevel] = useState(0);
    const [startTime, setStartTime] = useState<number | null>(null);
    const [currentTime, setCurrentTime] = useState(0);
    const [countdown, setCountdown] = useState(3);
    const [showCountdown, setShowCountdown] = useState(true);

    useEffect(() => {
        if (!showCountdown) return;

        const interval = setInterval(() => {
            setCountdown((prev) => prev - 1);
        }, 1000);

        if (countdown === 0) {
            clearInterval(interval);
            setShowCountdown(false);
            setStartTime(Date.now());
        }

        return () => clearInterval(interval);
    }, [countdown, showCountdown]);

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
        }, 500); // slight delay to let success state render
    };

    return (
        <div className="relative min-h-screen flex flex-col items-center bg-white px-6 pt-10">
            {showCountdown && (
                <div className="absolute inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
                    <div className="text-white text-6xl font-bold animate-pulse">
                        {countdown > 0 ? countdown : "Go!"}
                    </div>
                </div>
            )}

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
