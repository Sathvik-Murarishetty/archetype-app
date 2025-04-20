"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const answers = ["E", "B", "C", "B"];
const imagePaths = [
    "/abstract 1.webp",
    "/abstract 2.webp",
    "/abstract 3.webp",
    "/abstract 5.webp",
];
const questions = [
    "Which shape comes next in the sequence?",
    "Complete the sequence.",
    "Complete the sequence.",
    "Complete the sequence.",
];

export default function AdvancerGame() {
    const router = useRouter();
    const [level, setLevel] = useState(0);
    const [selected, setSelected] = useState<string | null>(null);
    const [wrong, setWrong] = useState<string | null>(null);
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

    const handleAnswer = (choice: string) => {
        if (answers[level] === choice) {
            setSelected(choice);
            setTimeout(() => {
                const isLast = level === answers.length - 1;
                if (isLast) {
                    const totalTime = startTime ? (Date.now() - startTime) / 1000 : 0;
                    localStorage.setItem("Advancer", totalTime.toString());
                    router.push("/game/");
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

      if (showIntro) {
        return (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg text-center w-[90%] max-w-md p-4">
              <Image
                src="/advancers-popup.jpg"
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
                <p className="font-jaro text-5xl font-medium text-white">
                    Advancer Archetype
                </p>
            </div>

            <div className="flex items-center justify-between w-full max-w-xl mb-8">
                <div className="flex-grow bg-gray-700 h-3 rounded-full overflow-hidden mr-4">
                    <div
                        className="bg-blue-500 h-full transition-all duration-300"
                        style={{
                            width: `${((level + 1) / questions.length) * 100}%`,
                        }}
                    />
                </div>
                <span className="text-gray-300 text-sm font-semibold">
                    {level + 1}/{questions.length}
                </span>
                <div className="flex items-center ml-6">
                    <Image
                        src="/timer-icon.png"
                        alt="Timer"
                        width={24}
                        height={24}
                        className="mr-2"
                    />
                    <span className="text-md font-semibold text-white">
                        {currentTime}s
                    </span>
                </div>
            </div>

            <div className="space-y-2 bg-gray-800 border-white w-full max-w-lg text-center p-6 bg-grey-500 text-black border rounded-xl shadow mb-6">
                <h2 className="text-lg font-bold text-white mb-2">
                    {questions[level]}
                </h2>
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
                            className={`w-12 h-12 rounded-full text-lg font-bold border-2 transition-all duration-300 ${selected === opt
                                    ? "bg-green-500 text-white"
                                    : wrong === opt
                                        ? "bg-red-500 text-white"
                                        : "bg-white text-black border-gray-300 hover:bg-gray-100"
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