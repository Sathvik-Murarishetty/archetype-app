"use client";

import { useState, useEffect } from "react";
import Confetti from "react-confetti";
import { useRouter } from "next/navigation";

const skills = [
    ["Write about personal challenges", "Document creative ideas", "Write creatively about ideas", "Create innovative concepts through writing", "Share personal stories to explain concepts", "Plan projects that align with passion"],
    ["Absorb creative ideas", "Tune into intuitive insights", "Listen for patterns in ideas", "Pick up on innovative sparks", "Hear out creative expression from others", "Listen for passion during brainstorming"],
    ["Notice subtle emotional cues", "Observe nuances in creative work", "Spot inconsistencies in ideas", "Notice tiny sparks of inspiration", "Pay attention to creative details", "Track personal project milestones"],
    ["Solve problems creatively", "Design new ways of creative expression", "Think critically about new ideas", "Innovate with passion and intuition", "Create out-of-the-box ideas", "Implement innovative passion projects"],
    ["Collaborate on passion projects", "Work together to express creativity", "Encourage critical thought in group creativity", "Innovate together within a passionate team", "Share ideas freely in the team", "Lead projects that inspire the team"],
    ["Organize projects based on passion", "Guide creative ideas to fruition", "Manage creative brainstorming", "Keep projects fresh with innovation", "Communicate passionately to the team", "Direct the team with visionary goals"]
];

export default function HobbyistsBingoCard() {
    const router = useRouter();
    const [checked, setChecked] = useState<Set<string>>(new Set());
    const [showPopup, setShowPopup] = useState(false);

    useEffect(() => {
        const total = skills.flat().length;
        if (checked.size === total) {
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

    return (
        <div className="min-h-screen bg-black text-white p-6">
            <h1 className="text-4xl font-bold mb-4 text-center">☁️ Hobbyists (The Dreamer)</h1>
            <h1 className="text-lg font-bold mb-4 text-center">Complete all the tasks under this archetype to skill up!</h1>
            <div className="overflow-x-auto">
                <table className="w-[80%] mx-auto table-fixed border-collapse">
                    <thead>
                        <tr className="bg-gray-800">
                            <th className="w-1/6 p-2 border border-gray-600">Skill/Task</th>
                            <th className="p-2 border border-gray-600">Problem Solving</th>
                            <th className="p-2 border border-gray-600">Creative Expression</th>
                            <th className="p-2 border border-gray-600">Critical Thinking</th>
                            <th className="p-2 border border-gray-600">Innovation</th>
                            <th className="p-2 border border-gray-600">Communication</th>
                            <th className="p-2 border border-gray-600">Project Management</th>
                        </tr>
                    </thead>
                    <tbody>
                        {skills.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                                <td className="font-semibold text-sm p-2 border border-gray-600 bg-gray-800">
                                    {["Writing", "Listening", "Attention to Detail", "Innovation", "Teamwork", "Project Management"][rowIndex]}
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
