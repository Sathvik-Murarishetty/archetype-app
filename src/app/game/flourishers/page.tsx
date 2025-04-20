"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { SketchPicker } from "react-color";
import Image from "next/image";

const sounds = [
    "calm-breeze.mp3",
    "gentle-waves.mp3",
    "soft-piano.mp3",
    "evening-crickets.mp3",
    "cozy-fireplace.mp3",
    "midnight-rain.mp3",
];

const prompts = [
    {
        icon: "🎶",
        title: "The Dreamy Sunset Moment",
        colorLabel: "Choose a color that represents the fading light of the day.",
        songLabel: "Choose a song that matches the vibe of a calm, peaceful evening.",
        vibeLabel: "Name the vibe: What would you call this moment?",
        bonusLabel: "Bonus: Add a short description or an emoji to describe the scene.",
        songs: sounds,
    },
    {
        icon: "🌿",
        title: "The Nature Escape",
        colorLabel: "Choose a color that reflects the greenery and serenity of nature.",
        songLabel: "Choose a song that evokes the sounds of birds, wind, and leaves rustling.",
        vibeLabel: "Name the vibe: What would you call this peaceful nature retreat?",
        bonusLabel: "Bonus: Create a mood with a short phrase or an emoji.",
        songs: sounds,
    },
    {
        icon: "🌌",
        title: "The Starry Night Adventure",
        colorLabel: "Choose a color that represents the deep, mysterious sky at night.",
        songLabel: "Choose a song that gives you the feeling of being on a quiet adventure under the stars.",
        vibeLabel: "Name the vibe: How would you describe the feeling of this adventure?",
        bonusLabel: "Bonus: Add a phrase or emoji to enhance the experience.",
        songs: sounds,
    },
];

function rgbToHsv(r: number, g: number, b: number) {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b),
        min = Math.min(r, g, b);
    let h = 0,
        s = 0;
    const v = max;

    const d = max - min;
    s = max === 0 ? 0 : d / max;

    if (max !== min) {
        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
                break;
        }
        h /= 6;
    }

    return { h: h * 360, s, v };
}

export default function FlourishersGame() {
    const router = useRouter();
    const [showIntro, setShowIntro] = useState(true);
    const [level, setLevel] = useState(0);
    const [startTime, setStartTime] = useState<number | null>(null);
    const [currentTime, setCurrentTime] = useState(0);

    const [responses, setResponses] = useState<
        { color: { h: number; s: number; v: number }; song: string; vibe: string; bonus: string }[]
    >([]);
    const [color, setColor] = useState<{ h: number; s: number; v: number }>({ h: 30, s: 0.5, v: 0.9 });
    const [song, setSong] = useState("");
    const [vibe, setVibe] = useState("");
    const [bonus, setBonus] = useState("");
    const [error, setError] = useState("");
    const [showColorPicker, setShowColorPicker] = useState(false);
    const pickerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (startTime) {
            timer = setInterval(() => {
                setCurrentTime(Math.floor((Date.now() - startTime) / 1000));
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [startTime]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
                setShowColorPicker(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleNext = () => {
        if (!song || !vibe.trim()) {
            setError("Please select a color, a song, and name the vibe before proceeding.");
            return;
        }
        setError("");
        const newResponse = { color, song, vibe, bonus };
        const updatedResponses = [...responses, newResponse];
        setResponses(updatedResponses);
        setColor({ h: 30, s: 0.5, v: 0.9 });
        setSong("");
        setVibe("");
        setBonus("");
        if (level < prompts.length - 1) {
            setLevel((prev) => prev + 1);
        } else {
            const totalTime = startTime ? (Date.now() - startTime) / 1000 : 0;
            localStorage.setItem("Flourishers", totalTime.toString());
            router.push("/game/");
        }
    };

    if (showIntro) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-lg text-center w-[90%] max-w-md p-4">
                    <Image
                        src="/flourishers-popup.jpg"
                        alt="Flourishers Intro"
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
        <div className="min-h-screen bg-black px-6 py-10 text-white">
            <div className="text-center mb-6">
                <h1 className="text-5xl font-jaro font-bold text-white">Flourishers Archetype</h1>
                <div className="w-full max-w-xl mx-auto mt-4 mb-4 flex items-center justify-between">
                    <div className="flex-grow bg-gray-700 h-3 rounded-full overflow-hidden mr-4">
                        <div
                            className="bg-green-500 h-full transition-all duration-300"
                            style={{ width: `${((level + 1) / prompts.length) * 100}%` }}
                        />
                    </div>
                    <span className="text-sm font-semibold text-white">
                        {level + 1}/{prompts.length}
                    </span>
                    <div className="flex items-center ml-6">
                        <Image src="/timer-icon.png" alt="Timer" width={24} height={24} className="mr-2" />
                        <span className="text-md font-semibold text-white">{currentTime}s</span>
                    </div>
                </div>
                {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
            </div>

            <div className="max-w-xl mx-auto bg-gray-900 border border-white rounded-xl p-6">
                <p className="text-xl font-semibold text-white mb-4">
                    {prompts[level].icon} {prompts[level].title}
                </p>

                <div className="block mb-6 relative" ref={pickerRef}>

                    <span className="text-white text-sm font-medium">{prompts[level].colorLabel}</span>
                    <div
                        className="w-full p-2 mt-2 h-12 rounded border border-white cursor-pointer"
                        style={{
                            backgroundColor: `hsl(${color.h}, ${color.s * 100}%, ${(color.v * 100) / 2}%)`,
                        }}
                        onClick={() => setShowColorPicker((prev) => !prev)}
                    />
                    {showColorPicker && (
                        <div className="absolute z-50 mt-2">
                            <SketchPicker
                                color={{
                                    r: 255,
                                    g: 255,
                                    b: 255,
                                    a: 1,
                                }}
                                onChange={(newColor: { rgb: { r: number; g: number; b: number } }) => {
                                    const { r, g, b } = newColor.rgb;
                                    const hsv = rgbToHsv(r, g, b);
                                    setColor(hsv);
                                }}
                            />
                        </div>
                    )}
                </div>
                <label className="block mb-4">
                    <span className="text-white text-sm font-medium">{prompts[level].songLabel}</span>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                        {prompts[level].songs.map((songFile, idx) => (
                            <div
                                key={idx}
                                onClick={() => setSong(songFile)}
                                className={`p-2 border rounded flex flex-col items-center cursor-pointer ${song === songFile ? "bg-green-800 border-green-500" : "bg-gray-800 border-gray-600"
                                    }`}
                            >
                                <audio controls className="w-full mb-1">
                                    <source src={`/sounds/${songFile}`} type="audio/mpeg" />
                                    Your browser does not support the audio element.
                                </audio>
                            </div>
                        ))}
                    </div>
                </label>

                <label className="block mb-4">
                    <span className="text-white text-sm font-medium">{prompts[level].vibeLabel}</span>
                    <input
                        type="text"
                        value={vibe}
                        onChange={(e) => setVibe(e.target.value)}
                        className="w-full border p-2 rounded mt-2 text-white bg-black border-white"
                        placeholder="Name your vibe..."
                    />
                </label>

                <button
                    onClick={handleNext}
                    className="mt-4 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
                >
                    {level === prompts.length - 1 ? "Submit" : "Next"}
                </button>
            </div>
        </div>
    );
}
