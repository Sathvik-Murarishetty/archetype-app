"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import HobbyistCanvas from "@/components/HobbyistCanvas";

const prompts = [
    ["A cat on a skateboard", "A rocket made of pizza", "A tree with sunglasses"],
    ["A robot playing violin", "A flying fish with wings", "A donut city"],
    ["A penguin on a surfboard", "A sandwich castle", "A snail on a rocket"],
    ["A dancing dinosaur", "A moon made of cheese", "A dragon reading a book"],
    ["A dog driving a car", "A space station in a teacup", "A flower riding a bike"]
];

export default function HobbyistsGame() {
    const router = useRouter();
    const [level, setLevel] = useState(1);
    const [startTime, setStartTime] = useState<number | null>(null);
    const [currentTime, setCurrentTime] = useState(0);
    const [countdown, setCountdown] = useState(3);
    const [showCountdown, setShowCountdown] = useState(true);
    const [canProceed, setCanProceed] = useState(false);
    const [showPrompt, setShowPrompt] = useState(true);
    const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);

    useEffect(() => {
        if (!showCountdown || showPrompt) return;

        const interval = setInterval(() => {
            setCountdown((prev) => prev - 1);
        }, 1000);

        if (countdown === 0) {
            clearInterval(interval);
            setShowCountdown(false);
            setStartTime(Date.now());
        }

        return () => clearInterval(interval);
    }, [countdown, showCountdown, showPrompt]);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (startTime) {
            timer = setInterval(() => {
                setCurrentTime(Math.floor((Date.now() - startTime) / 1000));
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [startTime]);

    const nextLevel = () => {
        setCanProceed(false);
        setSelectedPrompt(null);
        setShowPrompt(true);
        if (level < 5) {
            setLevel((prev) => prev + 1);
        } else {
            const totalTime = startTime ? (Date.now() - startTime) / 1000 : 0;
            localStorage.setItem("Hobbyists", totalTime.toString());
            router.push("/results");
        }
    };

    return (
        <div className="relative min-h-screen flex flex-col items-center bg-white px-6 pt-10">
            {(showCountdown || showPrompt) && (
                <div className="absolute inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
                    {showPrompt ? (
                        <div className="bg-white p-6 rounded-xl shadow-lg text-center max-w-md">
                            <h2 className="text-xl font-bold mb-4">Choose what to draw:</h2>
                            <div className="flex flex-col gap-3">
                                {prompts[level - 1].map((prompt, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => {
                                            setSelectedPrompt(prompt);
                                            setShowPrompt(false);
                                        }}
                                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                                    >
                                        {prompt}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="text-white text-6xl font-bold animate-pulse">
                            {countdown > 0 ? countdown : "Go!"}
                        </div>
                    )}
                </div>
            )}

            <div className="w-full max-w-xl mb-4 text-center">
                <p className="text-3xl font-medium text-black">Hobbyists Archetype</p>
            </div>

            <div className="flex items-center justify-between w-full max-w-xl mb-8">
                <div className="flex-grow bg-gray-200 h-3 rounded-full overflow-hidden mr-4">
                    <div
                        className="bg-blue-600 h-full transition-all duration-300"
                        style={{ width: `${(level / 5) * 100}%` }}
                    />
                </div>
                <span className="text-gray-700 text-sm font-semibold">{level}/5</span>

                <div className="flex items-center ml-6">
                    <Image src="/timer-icon.png" alt="Timer" width={24} height={24} className="mr-2" />
                    <span className="text-md font-semibold text-black">{currentTime}s</span>
                </div>
            </div>

            <div className="w-full max-w-lg text-center p-6 border rounded-xl shadow mb-6">
                <p className="text-xl font-medium text-gray-800 mb-4">
                    {selectedPrompt ? selectedPrompt : `Level ${level} Drawing Task`}
                </p>
                <HobbyistCanvas onDraw={() => setCanProceed(true)} />
            </div>

            <button
                disabled={!canProceed || showCountdown || showPrompt}
                onClick={nextLevel}
                className={`px-6 py-3 rounded-lg transition ${!canProceed || showCountdown || showPrompt
                        ? "bg-gray-400 text-white cursor-not-allowed"
                        : "bg-green-600 text-white hover:bg-green-700"
                    }`}
            >
                {level === 5 ? "Complete" : "Next Level"}
            </button>
        </div>
    );
}
