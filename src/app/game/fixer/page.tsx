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
    {
        red: [
            { row: 2, col: 0 },
            { row: 2, col: 4 },
        ],
        blue: [
            { row: 1, col: 1 },
            { row: 2, col: 3 },
        ],
        yellow: [
            { row: 0, col: 3 },
            { row: 3, col: 3 },
        ],
        green: [
            { row: 3, col: 4 },
            { row: 4, col: 1 },
        ],
    },
    {
        green: [
            { row: 0, col: 0 },
            { row: 5, col: 0 },
        ],
        yellow: [
            { row: 1, col: 5 },
            { row: 3, col: 1 },
        ],
        blue: [
            { row: 3, col: 2 },
            { row: 4, col: 1 },
        ],
        red: [
            { row: 4, col: 2 },
            { row: 4, col: 4 },
        ],
        orange: [
            { row: 2, col: 3 },
            { row: 3, col: 4 },
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
                router.push("/game/");
            }
        }, 500);
    };

      if (showIntro) {
        return (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg text-center w-[90%] max-w-md p-4">
              <Image
                src="/fixers-popup.jpg"
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
        <div className="relative min-h-screen flex flex-col items-center bg-black text-white px-6 pt-10">
            <div className="w-full max-w-xl mb-4 text-center">
                <p className="font-jaro text-5xl font-medium text-white">Fixer Archetype</p>
            </div>

            <div className="flex items-center justify-between w-full max-w-xl mb-8">
                <div className="flex-grow bg-gray-700 h-3 rounded-full overflow-hidden mr-4">
                    <div
                        className="bg-blue-500 h-full transition-all duration-300"
                        style={{
                            width: `${((level + 1) / levelConfigs.length) * 100}%`,
                        }}
                    />
                </div>
                <span className="text-gray-300 text-sm font-semibold">
                    {level + 1}/{levelConfigs.length}
                </span>
                <div className="flex items-center ml-6">
                    <Image
                        src="/timer-icon.png"
                        alt="Timer"
                        width={24}
                        height={24}
                        className="mr-2"
                    />
                    <span className="text-md font-semibold text-white">{currentTime}s</span>
                </div>
            </div>

            <div className="w-full max-w-lg mx-auto p-6 bg-black text-white rounded-xl shadow mb-6 flex justify-center">
                <FlowFreeBoard
                    key={level}
                    gridSize={6}
                    colorPairs={Object.entries(levelConfigs[level]).map(
                        ([color, [from, to]]) => ({
                            color,
                            from: [from.row, from.col],
                            to: [to.row, to.col],
                        })
                    )}
                    onComplete={handleLevelComplete}
                />
            </div>

        </div>
    );
}