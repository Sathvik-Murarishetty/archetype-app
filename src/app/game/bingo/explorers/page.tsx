"use client";

import { useState, useEffect } from "react";
import Confetti from "react-confetti";
import { useRouter } from "next/navigation";

const skills = [
    ["Discuss new challenges", "Share innovative discoveries", "Challenge existing assumptions", "Present experimental results", "Adjust communication based on new findings", "Keep project on track through discovery"],
    ["Write about new discoveries", "Document the innovative process", "Reflect on assumptions in writing", "Craft exploratory reports", "Revise project documents based on findings", "Write progress updates on new insights"],
    ["Tune into new ideas", "Listen to breakthrough concepts", "Absorb complex ideas critically", "Pay attention to experimental feedback", "Adjust approach based on what’s learned", "Listen for insights during discovery phases"],
    ["Spot new patterns in data", "Observe nuances in findings", "Analyze information in depth", "Notice subtle changes during experiments", "Adapt to new data and details", "Track project milestones closely"],
    ["Develop creative solutions", "Drive groundbreaking ideas", "Think critically about new approaches", "Test ideas through hands-on experimentation", "Find innovative ways to adapt to challenges", "Implement innovative techniques in project management"],
    ["Collaborate on research", "Innovate within the team", "Challenge the team to think critically", "Experiment together with new approaches", "Encourage the team to adapt and experiment", "Guide the team through phases of discovery"]
];

export default function ExplorersBingoCard() {
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
            <h1 className="text-4xl font-bold mb-4 text-center">🌍 Explorers (The Seeker)</h1>
            <h1 className="text-lg font-bold mb-4 text-center">Complete all the tasks under this archetype to skill up!</h1>
            <div className="overflow-x-auto">
                <table className="w-[80%] mx-auto table-fixed border-collapse">
                    <thead>
                        <tr className="bg-gray-800">
                            <th className="w-1/6 p-2 border border-gray-600">Skill/Task</th>
                            <th className="p-2 border border-gray-600">Problem Solving</th>
                            <th className="p-2 border border-gray-600">Innovation</th>
                            <th className="p-2 border border-gray-600">Critical Thinking</th>
                            <th className="p-2 border border-gray-600">Experimentation</th>
                            <th className="p-2 border border-gray-600">Adaptability</th>
                            <th className="p-2 border border-gray-600">Project Management</th>
                        </tr>
                    </thead>
                    <tbody>
                        {skills.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                                <td className="font-semibold text-sm p-2 border border-gray-600 bg-gray-800">
                                    {["Communication", "Writing", "Listening", "Attention to Detail", "Innovation", "Teamwork"][rowIndex]}
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
