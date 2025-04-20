"use client";

import { useState, useEffect } from "react";
import Confetti from "react-confetti";
import { useRouter } from "next/navigation";

const skills = [
    ["Present solutions with confidence", "Inspire team to reach goals", "Lead goal-oriented discussions", "Communicate decisions clearly", "Adapt messages based on progress", "Keep the team motivated through communication"],
    ["Write goal-driven plans", "Document success stories", "Analyze progress in writing", "Write a persuasive plan", "Revise strategies based on feedback", "Write a clear project update"],
    ["Listen to feedback on progress", "Hear team’s aspirations", "Listen for insights on strategy", "Listen to concerns about decisions", "Adjust approach based on feedback", "Track team morale and adjust accordingly"],
    ["Notice gaps in progress", "Ensure goals are met precisely", "Spot inconsistencies in analysis", "Identify risks in decisions", "Adapt to unexpected shifts in project details", "Refine project details for clarity"],
    ["Find new solutions to problems", "Innovate ways to achieve goals", "Design strategies to tackle challenges", "Innovate decision-making processes", "Adjust plans as circumstances change", "Implement innovative project strategies"],
    ["Collaborate toward success", "Lead by example, driving the team", "Encourage others to think critically", "Coordinate decisions within the team", "Foster flexibility in team roles", "Ensure everyone works together toward the goal"]
];

export default function AdvancersBingoCard() {
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
            <h1 className="text-4xl font-bold mb-4 text-center">🏅 Advancers (The Hero)</h1>
            <h1 className="text-lg font-bold mb-4 text-center">Complete all the tasks under this archetype to skill up!</h1>
            <div className="overflow-x-auto">
                <table className="w-[80%] mx-auto table-fixed border-collapse">
                    <thead>
                        <tr className="bg-gray-800">
                            <th className="w-1/6 p-2 border border-gray-600">Skill/Task</th>
                            <th className="p-2 border border-gray-600">Problem Solving</th>
                            <th className="p-2 border border-gray-600">Leadership</th>
                            <th className="p-2 border border-gray-600">Critical Thinking</th>
                            <th className="p-2 border border-gray-600">Decision Making</th>
                            <th className="p-2 border border-gray-600">Adaptability</th>
                            <th className="p-2 border border-gray-600">Project Management</th>
                        </tr>
                    </thead>
                    <tbody>
                        {skills.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                                <td className="font-semibold text-sm p-2 border border-gray-600 bg-gray-800">
                                    {[
                                        "Communication",
                                        "Writing",
                                        "Listening",
                                        "Attention to Detail",
                                        "Innovation",
                                        "Teamwork"
                                    ][rowIndex]}
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
