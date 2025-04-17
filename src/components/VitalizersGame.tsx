"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const questions = [
    {
        title: "\ud83c\udfde The Public Park Problem",
        prompt: "The town park is about to be shut down due to poor upkeep. Choose your fix:",
        options: [
            "Build a mall instead.",
            "Host a clean-up and art mural event with residents.",
            "Put a fence and \"no entry\" sign.",
        ],
        answer: 1,
    },
    {
        title: "\ud83c\udf71 Schoolchildren Without Midday Meals",
        prompt: "Kids in government schools are coming without lunch. Choose your action:",
        options: [
            "Set up a town-wide community kitchen.",
            "Announce a fine for parents who don’t pack lunch.",
            "Post posters asking kids to bring food.",
        ],
        answer: 0,
    },
    {
        title: "\ud83e\ude91 Elderly Feel Unsafe in the Area",
        prompt: "Senior citizens feel unsafe walking alone. Choose your approach:",
        options: [
            "Organize youth-senior walking buddy system.",
            "Install more CCTVs.",
            "Ask them to avoid going out.",
        ],
        answer: 0,
    },
    {
        title: "\ud83e\uddd1\ud83c\udffd‍\ud83c\udfa8 Young People Feel Bored & Disconnected",
        prompt: "Teens and college students say they feel aimless. Choose your plan:",
        options: [
            "Organize monthly open mic nights and workshops.",
            "Launch a social media competition.",
            "Tell them to find their own way.",
        ],
        answer: 0,
    },
    {
        title: "\ud83d\udd6f Community Festival Planning",
        prompt: "You’re in charge of planning a festival. Some communities feel excluded. Choose your move:",
        options: [
            "Host a unity parade and potluck with all neighborhoods.",
            "Stick with the usual plan.",
            "Make separate events for each group.",
        ],
        answer: 0,
    },
];

export default function VitalizersGame() {
    const router = useRouter();
    const [index, setIndex] = useState(0);
    const [selected, setSelected] = useState<number | null>(null);
    const [startTimestamp, setStartTimestamp] = useState<number | null>(null);
    const [timeElapsed, setTimeElapsed] = useState(0);
    const [showIntro, setShowIntro] = useState(true);

    useEffect(() => {
        if (!startTimestamp) return;
        const interval = setInterval(() => {
            setTimeElapsed(Math.floor((Date.now() - startTimestamp) / 1000));
        }, 1000);
        return () => clearInterval(interval);
    }, [startTimestamp]);

    const handleSelect = (i: number) => {
        if (selected !== null) return;
        setSelected(i);
        setTimeout(() => {
            if (index === questions.length - 1) {
                localStorage.setItem("Vitalizers", timeElapsed.toString());
                router.push("/");
            } else {
                setIndex(index + 1);
                setSelected(null);
            }
        }, 1000);
    };

    const q = questions[index];

    if (showIntro) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg shadow-lg text-center md:w-[650px]">
                    <div className="flex items-center justify-center gap-6 mb-4">
                        <Image src="/vitalizers.png" alt="emoji" width={130} height={130} />
                        <div className="text-left">
                            <h2 className="text-2xl font-bold text-black">Vitalizers</h2>
                            <h3 className="text-lg font-semibold text-gray-700">The ZenZ</h3>
                            <p className="text-sm text-gray-700">
                                ZenZ learners are deeply connected to their inner world. They see learning as part of
                                healing, balance, and growth. They meditate before study sessions and believe a cozy space
                                leads to a clear mind.
                            </p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4 text-left">
                        <div>
                            <p className="text-sm font-bold text-black">STRENGTHS</p>
                            <ul className="text-sm text-gray-700 list-disc list-inside">
                                <li>Emotionally intelligent and calm under pressure</li>
                                <li>Highly intuitive and reflective</li>
                                <li>Values well-being in the learning journey</li>
                            </ul>
                        </div>
                        <div>
                            <p className="text-sm font-bold text-black">WEAKNESSES</p>
                            <ul className="text-sm text-gray-700 list-disc list-inside">
                                <li>May avoid hard topics that create discomfort</li>
                                <li>Prefers gentle growth over quick results</li>
                                <li>Struggles with deadlines</li>
                            </ul>
                        </div>
                    </div>
                    <p className="italic text-sm text-black mb-4">
                        “Learning is part of my self-care routine”
                    </p>
                    <button
                        onClick={() => {
                            setShowIntro(false);
                            setStartTimestamp(Date.now());
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
        <div className="min-h-screen flex flex-col items-center px-6 pt-10 bg-white">
            <div className="w-full max-w-xl mb-6 text-center">
                <p className="text-3xl font-bold text-black">Vitalizers Archetype</p>
            </div>

            <div className="flex items-center justify-between w-full max-w-xl mb-8">
                <div className="flex-grow bg-gray-200 h-3 rounded-full overflow-hidden mr-4">
                    <div
                        className="bg-green-600 h-full transition-all duration-300"
                        style={{ width: `${((index + 1) / questions.length) * 100}%` }}
                    />
                </div>
                <span className="text-gray-700 text-sm font-semibold">
                    {index + 1}/{questions.length}
                </span>
                <div className="flex items-center ml-6">
                    <Image src="/timer-icon.png" alt="Timer" width={24} height={24} className="mr-2" />
                    <span className="text-md font-semibold text-black">{timeElapsed}s</span>
                </div>
            </div>

            <div className="w-full max-w-xl bg-gray-50 p-6 rounded-xl shadow text-center mb-6">
                <h2 className="text-xl font-semibold mb-2 text-black">{q.title}</h2>
                <p className="mb-4 text-black">{q.prompt}</p>
                {q.options.map((opt, i) => (
                    <button
                        key={i}
                        onClick={() => handleSelect(i)}
                        disabled={selected !== null}
                        className={`block w-full px-4 py-2 mb-3 rounded-lg border text-left transition text-black
              ${selected === null ? "bg-white hover:bg-green-100" :
                                i === q.answer ? "bg-green-200 border-green-600" :
                                    selected === i ? "bg-red-200 border-red-600" : "bg-white"}`}
                    >
                        {opt}
                    </button>
                ))}
            </div>
        </div>
    );
}
