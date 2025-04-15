"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const answers = ["E", "B", "C", "E", "B"];
const imagePaths = [
    "/abstract 1.webp",
    "/abstract 2.webp",
    "/abstract 3.webp",
    "/abstract 4.webp",
    "/abstract 5.webp",
];

export default function AdvancerGame() {
    const router = useRouter();
    const [level, setLevel] = useState(0);
    const [selected, setSelected] = useState<string | null>(null);
    const [wrong, setWrong] = useState<string | null>(null);
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

    const handleAnswer = (choice: string) => {
        if (answers[level] === choice) {
            setSelected(choice);
            setTimeout(() => {
                if (level === 4) {
                    const totalTime = startTime ? (Date.now() - startTime) / 1000 : 0;
                    localStorage.setItem("Advancer", totalTime.toString());
                    router.push("/");
                } else {
                    setLevel((prev) => prev + 1);
                    setSelected(null);
                }
            }, 400);
        } else {
            setWrong(choice);
            setTimeout(() => setWrong(null), 2000);
        }
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
                <p className="text-3xl font-medium text-black">Advancer Archetype</p>
            </div>

            <div className="flex items-center justify-between w-full max-w-xl mb-8">
                <div className="flex-grow bg-gray-200 h-3 rounded-full overflow-hidden mr-4">
                    <div
                        className="bg-blue-600 h-full transition-all duration-300"
                        style={{ width: `${((level + 1) / 5) * 100}%` }}
                    />
                </div>
                <span className="text-gray-700 text-sm font-semibold">{level + 1}/5</span>
                <div className="flex items-center ml-6">
                    <Image src="/timer-icon.png" alt="Timer" width={24} height={24} className="mr-2" />
                    <span className="text-md font-semibold text-black">{currentTime}s</span>
                </div>
            </div>

            <div className="w-full max-w-lg text-center p-6 border rounded-xl shadow mb-6">
                <Image
                    src={imagePaths[level]}
                    alt={`Level ${level + 1}`}
                    width={600}
                    height={300}
                    className="mx-auto mb-4 rounded"
                />
                <div className="flex justify-center gap-4 flex-wrap">
                    {["A", "B", "C", "D", "E"].map((opt) => (
                        <button
                            key={opt}
                            onClick={() => handleAnswer(opt)}
                            className={`w-12 h-12 rounded-full text-lg font-bold border-2 transition-all duration-300 ${selected === opt ? "bg-green-500 text-white" :
                                    wrong === opt ? "bg-red-500 text-white" :
                                        "bg-white text-black border-gray-300 hover:bg-gray-100"
                                }`}
                            disabled={!!selected}
                        >
                            {opt}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
