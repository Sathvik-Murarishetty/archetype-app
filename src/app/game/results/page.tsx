"use client";

export default function Results() {
    const archetypes = [
        "Advancer", "Fixer", "Explorer",
        "Preparers", "Flourishers", "Vitalizers", "Hobbyists"
    ];

    const times = archetypes.map(name => ({
        name,
        time: parseFloat(localStorage.getItem(name) || "9999")
    }));

    const best = times.reduce((a, b) => a.time < b.time ? a : b);

    return (
        <div className="text-center p-10">
            <h1 className="text-3xl font-bold mb-4">Your Archetype is:</h1>
            <h2 className="text-4xl text-blue-600">{best.name}</h2>
            <p className="mt-4">Fastest game completed in {best.time.toFixed(2)} seconds!</p>
        </div>
    );
}
