"use client";

import { useState, useEffect } from "react";
import Confetti from "react-confetti";
import { useRouter } from "next/navigation";

const skills = [
    ["Write motivational speeches", "Document teamwork achievements", "Write empathetic messages", "Write about solving community issues", "Share team success stories", "Plan community-focused projects"],
    ["Hear team members' concerns", "Tune into team dynamics", "Listen for emotional cues", "Listen for solutions to problems", "Adjust communication based on team feedback", "Listen for concerns during project planning"],
    ["Notice team morale shifts", "Observe community needs", "Spot emotional changes in teams", "Detect problems early in teams", "Pick up on key community signals", "Keep track of team involvement and progress"],
    ["Lead with innovative ideas", "Innovate team collaboration", "Bring fresh emotional insights", "Solve community issues creatively", "Inspire the team with new communication methods", "Innovate community engagement strategies"],
    ["Inspire the team with words", "Foster teamwork through communication", "Lead with empathy in communication", "Solve problems with effective communication", "Adjust tone based on team needs", "Keep the team engaged with clear, empathetic communication"],
    ["Guide team to success with vision", "Manage team dynamics effectively", "Lead with emotional intelligence", "Solve problems with a collaborative approach", "Keep the community informed and engaged", "Oversee project completion while maintaining team morale"]
];

export default function VitalizersBingoCard() {
    const router = useRouter();
    const [checked, setChecked] = useState<Set<string>>(new Set());
    const [showPopup, setShowPopup] = useState(false);
    const [complete, setComplete] = useState(false);

    const totalTasks = skills.flat().length;

    useEffect(() => {
        const saved = localStorage.getItem("vitalizer_checked");
        const completed = localStorage.getItem("vitalizer_complete");
        const hasSeenPopup = localStorage.getItem("vitalizer_popup_seen");

        if (saved) setChecked(new Set(JSON.parse(saved)));
        if (completed === "true") {
            setComplete(true);
            if (!hasSeenPopup) {
                setTimeout(() => setShowPopup(true), 300);
                localStorage.setItem("vitalizer_popup_seen", "true");
            }
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("vitalizer_checked", JSON.stringify(Array.from(checked)));
        const isComplete = checked.size === totalTasks;
        if (isComplete && !complete) {
            setComplete(true);
            localStorage.setItem("vitalizer_complete", "true");
            localStorage.setItem("vitalizer_popup_seen", "true");
            setTimeout(() => setShowPopup(true), 300);
        }
    }, [checked]);

    const toggleCheck = (item: string) => {
        setChecked(prev => {
            const next = new Set(prev);
            if (next.has(item)) next.delete(item);
            else next.add(item);
            return next;
        });
    };

    const handleReset = () => {
        localStorage.removeItem("vitalizer_checked");
        localStorage.removeItem("vitalizer_complete");
        localStorage.removeItem("vitalizer_popup_seen");
        setChecked(new Set());
        setComplete(false);
        setShowPopup(false);
    };

    return (
        <div className="min-h-screen bg-black text-white p-6">
            <h1 className="text-4xl font-bold mb-4 text-center">✨ Vitalizers (The Social Leader)</h1>
            <h1 className="text-lg font-bold mb-4 text-center">Complete all the tasks under this archetype to skill up!</h1>

            {complete && !showPopup && (
                <div className="text-center mb-6">
                    <button
                        onClick={handleReset}
                        className="bg-red-600 text-white px-4 py-2 mt-4 rounded hover:bg-red-700"
                    >
                        Reset Progress
                    </button>
                </div>
            )}

            <div className="overflow-x-auto">
                <table className="w-[80%] mx-auto table-fixed border-collapse">
                    <thead>
                        <tr className="bg-gray-800">
                            <th className="w-1/6 p-2 border border-gray-600">Skill/Task</th>
                            <th className="p-2 border border-gray-600">Leadership</th>
                            <th className="p-2 border border-gray-600">Teamwork</th>
                            <th className="p-2 border border-gray-600">Emotional Intelligence</th>
                            <th className="p-2 border border-gray-600">Problem Solving</th>
                            <th className="p-2 border border-gray-600">Communication</th>
                            <th className="p-2 border border-gray-600">Project Management</th>
                        </tr>
                    </thead>
                    <tbody>
                        {skills.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                                <td className="font-semibold text-sm p-2 border border-gray-600 bg-gray-800">
                                    {["Writing", "Listening", "Attention to Detail", "Innovation", "Communication", "Project Management"][rowIndex]}
                                </td>
                                {row.map((item, colIndex) => (
                                    <td
                                        key={colIndex}
                                        className={`p-2 border border-gray-600 text-sm cursor-pointer ${checked.has(item) ? "bg-gray-600 opacity-60" : "bg-gray-900 hover:bg-green-700"}`}
                                        onClick={() => toggleCheck(item)}
                                    >
                                        <label className="flex items-start gap-2">
                                            <input type="checkbox" checked={checked.has(item)} readOnly className="mt-1" />
                                            <span>{item}</span>
                                        </label>
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-xl shadow-lg text-center max-w-sm">
                        <h2 className="text-xl font-bold text-green-600 mb-2">🎉 You completed all tasks!</h2>
                        <button
                            onClick={() => router.push("/")}
                            className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                        >
                            Go to Home Page
                        </button>
                    </div>
                    <Confetti numberOfPieces={300} recycle={false} />
                </div>
            )}
        </div>
    );
}
