"use client";

import { useEffect, useRef, useState } from "react";
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
    const [elapsedTime, setElapsedTime] = useState(0);
    const [pausedAt, setPausedAt] = useState<number | null>(null);
    const [showIntro, setShowIntro] = useState(true);
    const [showPrompt, setShowPrompt] = useState(true);
    const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);
    const [canProceed, setCanProceed] = useState(false);
    const canvasRef = useRef<{ clearCanvas: () => void }>(null);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (startTime && !showPrompt) {
            timer = setInterval(() => {
                const baseTime = pausedAt ? pausedAt : Date.now();
                setElapsedTime(Math.floor((baseTime - startTime) / 1000));
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [startTime, showPrompt, pausedAt]);

    useEffect(() => {
        if (showPrompt && startTime) {
            setPausedAt(Date.now());
        } else if (!showPrompt && pausedAt && startTime) {
            const pauseDuration = Date.now() - pausedAt;
            setStartTime((prev) => prev ? prev + pauseDuration : null);
            setPausedAt(null);
        }
    }, [showPrompt]);

    const nextLevel = () => {
        setCanProceed(false);
        setSelectedPrompt(null);
        setShowPrompt(true);
        canvasRef.current?.clearCanvas();
        if (level < 5) {
            setLevel((prev) => prev + 1);
        } else {
            localStorage.setItem("Hobbyists", elapsedTime.toString());
            router.push("/game/");
        }
    };

  if (showIntro) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg text-center w-[90%] max-w-md p-4">
          <Image
            src="/hobbyists-popup.jpg"
            alt="Preparers Info"
            width={400}
            height={300}
            className="w-full h-auto object-cover rounded-md mb-4"
          />
          <button
            onClick={() => {
              setShowIntro(false);
              setStartTime(Date.now());
            }}
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
          >
            Proceed
          </button>
        </div>
      </div>
    );
  }

    return (
        <div className="relative min-h-screen flex flex-col items-center bg-black px-6 pt-10 text-white">
            {showPrompt && (
                <div className="absolute inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
                    <div className="bg-gray-900 text-white p-6 rounded-xl shadow-lg text-center max-w-md">
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
                </div>
            )}

            <div className="w-full max-w-xl mb-4 text-center">
                <p className="text-5xl font-jaro">Hobbyists Archetype</p>
            </div>

            <div className="flex items-center justify-between w-full max-w-xl mb-8">
                <div className="flex-grow bg-gray-700 h-3 rounded-full overflow-hidden mr-4">
                    <div
                        className="bg-blue-600 h-full transition-all duration-300"
                        style={{ width: `${(level / 5) * 100}%` }}
                    />
                </div>
                <span className="text-white text-sm font-semibold">{level}/5</span>

                <div className="flex items-center ml-6">
                    <Image src="/timer-icon.png" alt="Timer" width={24} height={24} className="mr-2" />
                    <span className="text-md font-semibold">{elapsedTime}s</span>
                </div>
            </div>

            <div className="w-full max-w-lg text-center p-6 bg-gray-900 text-white border rounded-xl shadow mb-6">
                <p className="text-xl font-medium mb-4">
                    {selectedPrompt ? selectedPrompt : `Level ${level} Drawing Task`}
                </p>
                <HobbyistCanvas ref={canvasRef} onDraw={() => setCanProceed(true)} />
            </div>

            <button
                disabled={!canProceed || showPrompt}
                onClick={nextLevel}
                className={`px-6 py-3 mb-5 rounded-lg transition ${!canProceed || showPrompt
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : "bg-green-600 text-white hover:bg-green-700"
                    }`}
            >
                {level === 5 ? "Complete" : "Next Level"}
            </button>
        </div>
    );
}
