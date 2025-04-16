"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { HsvColorPicker } from "react-colorful";

const prompts = [
    {
        icon: "🎶",
        title: "The Dreamy Sunset Moment",
        colorLabel: "Choose a color that represents the fading light of the day.",
        songLabel: "Choose a song that matches the vibe of a calm, peaceful evening.",
        vibeLabel: "Name the vibe: What would you call this moment?",
        bonusLabel: "Bonus: Add a short description or an emoji to describe the scene.",
        songs: ["sunset1.mp3", "sunset2.mp3", "sunset3.mp3", "sunset4.mp3", "sunset5.mp3", "sunset6.mp3"]
    },
    {
        icon: "🌿",
        title: "The Nature Escape",
        colorLabel: "Choose a color that reflects the greenery and serenity of nature.",
        songLabel: "Choose a song that evokes the sounds of birds, wind, and leaves rustling.",
        vibeLabel: "Name the vibe: What would you call this peaceful nature retreat?",
        bonusLabel: "Bonus: Create a mood with a short phrase or an emoji.",
        songs: ["nature1.mp3", "nature2.mp3", "nature3.mp3", "nature4.mp3", "nature5.mp3", "nature6.mp3"]
    },
    {
        icon: "🌌",
        title: "The Starry Night Adventure",
        colorLabel: "Choose a color that represents the deep, mysterious sky at night.",
        songLabel: "Choose a song that gives you the feeling of being on a quiet adventure under the stars.",
        vibeLabel: "Name the vibe: How would you describe the feeling of this adventure?",
        bonusLabel: "Bonus: Add a phrase or emoji to enhance the experience.",
        songs: ["stars1.mp3", "stars2.mp3", "stars3.mp3", "stars4.mp3", "stars5.mp3", "stars6.mp3"]
    },
    {
        icon: "☕",
        title: "The Cozy Café Corner",
        colorLabel: "Choose a color that gives off warm, cozy, and inviting vibes.",
        songLabel: "Choose a song that feels like the soundtrack to sipping coffee with a book in hand.",
        vibeLabel: "Name the vibe: What would you call this relaxing moment?",
        bonusLabel: "Bonus: Write a short description of the scene or use an emoji.",
        songs: ["cafe1.mp3", "cafe2.mp3", "cafe3.mp3", "cafe4.mp3", "cafe5.mp3", "cafe6.mp3"]
    },
    {
        icon: "🛸",
        title: "The Late-Night Drive",
        colorLabel: "Choose a color that represents the feel of driving through empty streets at night.",
        songLabel: "Choose a song that matches the quiet, introspective nature of a late-night drive.",
        vibeLabel: "Name the vibe: What would you call the mood of this drive?",
        bonusLabel: "Bonus: Add a phrase or emoji that fits the atmosphere.",
        songs: ["drive1.mp3", "drive2.mp3", "drive3.mp3", "drive4.mp3", "drive5.mp3", "drive6.mp3"]
    }
];

export default function FlourishersGame() {
    const router = useRouter();
    const [level, setLevel] = useState(0);
    const [startTime, setStartTime] = useState<number | null>(null);
    const [currentTime, setCurrentTime] = useState(0);
    const [responses, setResponses] = useState<any[]>([]);
    const [color, setColor] = useState("#ffcc80");
    const [song, setSong] = useState("");
    const [vibe, setVibe] = useState("");
    const [bonus, setBonus] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        setStartTime(Date.now());
    }, []);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (startTime) {
            timer = setInterval(() => {
                setCurrentTime(Math.floor((Date.now() - startTime) / 1000));
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [startTime]);

    const handleNext = () => {
        if (!song || !vibe.trim() || !color) {
            setError("Please select a color, a song, and name the vibe before proceeding.");
            return;
        }
        setError("");
        const newResponse = { color, song, vibe, bonus };
        const updatedResponses = [...responses, newResponse];
        setResponses(updatedResponses);
        setColor("#ffcc80");
        setSong("");
        setVibe("");
        setBonus("");
        if (level < prompts.length - 1) {
            setLevel((prev) => prev + 1);
        } else {
            const totalTime = startTime ? (Date.now() - startTime) / 1000 : 0;
            localStorage.setItem("Flourishers", totalTime.toString());
            router.push("/");
        }
    };

    return (
        <div className="min-h-screen bg-white px-6 py-10">
            <div className="text-center mb-6">
                <h1 className="text-3xl font-bold text-black">Flourishers Archetype</h1>
                <p className="text-gray-600 text-sm mt-1">Level {level + 1}/5</p>
                <p className="text-gray-800 text-sm mt-1">Time: {currentTime}s</p>
                {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
            </div>

            <div className="max-w-xl mx-auto bg-gray-50 border rounded-xl p-6">
                <p className="text-xl font-semibold text-black mb-4">
                    {prompts[level].icon} {prompts[level].title}
                </p>

                <label className="block mb-4">
                    <span className="text-black text-sm font-medium">{prompts[level].colorLabel}</span>
                    <div className="mt-4 flex justify-center">
                        <HsvColorPicker
                            color={color}
                            onChange={setColor}
                            style={{ width: "220px", height: "220px" }}
                        />
                    </div>
                </label>

                <label className="block mb-4">
                    <span className="text-black text-sm font-medium">{prompts[level].songLabel}</span>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                        {prompts[level].songs.map((songFile, idx) => (
                            <div
                                key={idx}
                                onClick={() => setSong(songFile)}
                                className={`p-2 border rounded text-black flex flex-col items-center cursor-pointer ${song === songFile ? "bg-green-100 border-green-500" : "bg-white"}`}
                            >
                                <audio controls className="w-full mb-1">
                                    <source src={`/sounds/${songFile}`} type="audio/mpeg" />
                                </audio>
                            </div>
                        ))}
                    </div>
                </label>

                <label className="block mb-4">
                    <span className="text-black text-sm font-medium">{prompts[level].vibeLabel}</span>
                    <input
                        type="text"
                        value={vibe}
                        onChange={(e) => setVibe(e.target.value)}
                        className="w-full border p-2 rounded mt-2"
                        placeholder="Name your vibe..."
                    />
                </label>

                <label className="block mb-4">
                    <span className="text-black text-sm font-medium">{prompts[level].bonusLabel}</span>
                    <input
                        type="text"
                        value={bonus}
                        onChange={(e) => setBonus(e.target.value)}
                        className="w-full border p-2 rounded mt-2"
                        placeholder="Add your mood phrase or emoji..."
                    />
                </label>

                <button
                    onClick={handleNext}
                    className="mt-4 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
                >
                    {level === 4 ? "Submit" : "Next"}
                </button>
            </div>
        </div>
    );
}
