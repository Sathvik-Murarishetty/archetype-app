"use client";

import { useState, useEffect } from "react";
import Confetti from "react-confetti";
import { useRouter } from "next/navigation";

const skills = [
    ["Explain practical solutions", "Share creative ideas", "Teach practical concepts", "Present thought-provoking ideas", "Present experimental methods", "Keep team aligned on practical tasks"],
    ["Write step-by-step guides", "Document hands-on solutions", "Write about practical application", "Craft critical essays on hands-on methods", "Write about experimental results", "Write a clear project action plan"],
    ["Absorb feedback on practical tasks", "Listen for new creative concepts", "Pay attention to practical suggestions", "Tune into practical ideas", "Listen to feedback from experiments", "Listen to project updates and adjust accordingly"],
    ["Notice practical flaws", "Spot nuances in hands-on work", "Observe how ideas translate into action", "Analyze practical outcomes", "Track experimental changes closely", "Refine project tasks with attention to detail"],
    ["Innovate through hands-on work", "Create new ways to approach tasks", "Develop practical, actionable solutions", "Think critically about practical solutions", "Try new methods in experimentation", "Drive hands-on innovation through action"],
    ["Work with the team on projects", "Collaborate on hands-on tasks", "Share practical ideas with the team", "Guide others in critical thinking about practical methods", "Experiment with team collaboration", "Manage team tasks through hands-on action"]
];

export default function FlourishersBingoCard() {
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
            <h1 className="text-2xl font-bold mb-4 text-center">🛠️ Flourishers (The Creator)</h1>
            <div className="overflow-x-auto">
                <table className="w-[80%] mx-auto table-fixed border-collapse">
                    <thead>
                        <tr className="bg-gray-800">
                            <th className="w-1/6 p-2 border border-gray-600">Skill/Task</th>
                            <th className="p-2 border border-gray-600">Problem Solving</th>
                            <th className="p-2 border border-gray-600">Innovation</th>
                            <th className="p-2 border border-gray-600">Practical Application</th>
                            <th className="p-2 border border-gray-600">Critical Thinking</th>
                            <th className="p-2 border border-gray-600">Experimentation</th>
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
