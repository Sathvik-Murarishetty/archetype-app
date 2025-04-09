"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function FlourishersGame() {
    const router = useRouter();
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

    const completeLevel = () => {
        const totalTime = startTime ? (Date.now() - startTime) / 1000 : 0;
        localStorage.setItem("Flourishers", totalTime.toString());
        router.push("/game/vitalizers");
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
                <p className="text-3xl font-medium text-black">Flourishers Archetype</p>
            </div>

            <div className="flex items-center justify-between w-full max-w-xl mb-8">
                <div className="flex-grow bg-gray-200 h-3 rounded-full overflow-hidden mr-4">
                    <div className="bg-blue-600 h-full transition-all duration-300 w-full" />
                </div>
                <span className="text-gray-700 text-sm font-semibold">1/1</span>

                <div className="flex items-center ml-6">
                    <Image src="/timer-icon.png" alt="Timer" width={24} height={24} className="mr-2" />
                    <span className="text-md font-semibold text-black">{currentTime}s</span>
                </div>
            </div>

            <div className="w-full max-w-lg text-center p-6 border rounded-xl shadow mb-6">
                <p className="text-xl font-medium">Flourisher Level Task Placeholder</p>
                <p className="text-sm text-gray-500 mt-2">Your game logic goes here.</p>
            </div>

            <button
                onClick={completeLevel}
                disabled={showCountdown}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
            >
                Complete
            </button>
        </div>
    );
}