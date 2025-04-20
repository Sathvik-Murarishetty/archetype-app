"use client";

import { useState, useEffect } from "react";
import Confetti from "react-confetti";
import { useRouter } from "next/navigation";

const skills = [
    ["Present solutions to complex problems", "Explain complex concepts clearly", "Share innovative ideas", "Communicate the decision-making process", "Adapt messages based on progress", "Keep the team aligned through communication"],
    ["Write detailed solutions", "Document the analysis process", "Create innovative proposals", "Write decisions based on analysis", "Revise strategies as new challenges arise", "Write a step-by-step project plan"],
    ["Listen for practical feedback", "Pay attention to critical arguments", "Absorb innovative ideas", "Listen for decision-making cues", "Adjust project based on new feedback", "Adapt project flow based on team feedback"],
    ["Spot potential obstacles", "Recognize flaws in systems", "Identify opportunities in constraints", "Detect flaws in decision-making processes", "Notice subtle shifts in project progress", "Refine project steps with precision"],
    ["Create efficient solutions", "Apply critical thinking to innovation", "Drive groundbreaking ideas", "Innovate with clear decision-making models", "Adapt innovations for unexpected changes", "Drive innovation throughout the project"],
    ["Work with the team to find solutions", "Guide team through critical analysis", "Encourage innovation within the team", "Lead the team in decision-making", "Guide the team to adapt quickly", "Manage project team through obstacles"]
];

export default function FixersBingoCard() {
    const router = useRouter();
    const [checked, setChecked] = useState<Set<string>>(new Set());
    const [showPopup, setShowPopup] = useState(false);
    const [complete, setComplete] = useState(false);

    const totalTasks = skills.flat().length;

    useEffect(() => {
        const saved = localStorage.getItem("fixer_checked");
        const completed = localStorage.getItem("fixer_complete");
        const hasSeenPopup = localStorage.getItem("fixer_popup_seen");

        if (saved) setChecked(new Set(JSON.parse(saved)));
        if (completed === "true") {
            setComplete(true);
            if (!hasSeenPopup) {
                setTimeout(() => setShowPopup(true), 300);
                localStorage.setItem("fixer_popup_seen", "true");
            }
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("fixer_checked", JSON.stringify(Array.from(checked)));
        const isComplete = checked.size === totalTasks;
        if (isComplete && !complete) {
            setComplete(true);
            localStorage.setItem("fixer_complete", "true");
            localStorage.setItem("fixer_popup_seen", "true");
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
        localStorage.removeItem("fixer_checked");
        localStorage.removeItem("fixer_complete");
        localStorage.removeItem("fixer_popup_seen");
        setChecked(new Set());
        setComplete(false);
        setShowPopup(false);
    };

    return (
        <div className="min-h-screen bg-black text-white p-6">
            <h1 className="text-4xl font-bold mb-4 text-center">⚙️ Fixers (The Engineer/Alchemist)</h1>
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
                            <th className="p-2 border border-gray-600">Problem Solving</th>
                            <th className="p-2 border border-gray-600">Critical Thinking</th>
                            <th className="p-2 border border-gray-600">Innovation</th>
                            <th className="p-2 border border-gray-600">Decision Making</th>
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
