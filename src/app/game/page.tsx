"use client";

import { useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import ArchetypeCard from "../../components/ArchetypeCard";
import Image from "next/image";
import Confetti from "react-confetti";

/* ── archetype meta data ───────────────────────────── */
const archetypes = [
    { title: "Advancer", description: "Motivated by progress and time‑based challenge" },
    { title: "Fixer", description: "Solves problems with precision" },
    { title: "Explorer", description: "Curious, trial‑and‑error learner" },
    { title: "Preparers", description: "Plans everything in advance" },
    { title: "Flourishers", description: "Loves creativity and patterns" },
    { title: "Vitalizers", description: "Quick, energetic responder" },
    { title: "Hobbyists", description: "Enjoys learning through play" },
] as const;

/* ─────────────────────────────────────────────────── */
export default function Home() {
    const router = useRouter();

    const [times, setTimes] = useState<Record<string, string>>({});
    const [fastest, setFastest] = useState<string | null>(null);
    const [subdominant, setSubdominant] = useState<string | null>(null);

    const [allCompleted, setAllCompleted] = useState(false);   // have all games finished?
    const [showPopup, setShowPopup] = useState(false);   // confetti + modal visibility

    /* ── load completion times on mount ─────────────── */
    useEffect(() => {
        const loaded: Record<string, string> = {};
        const completed: { title: string; time: number }[] = [];

        archetypes.forEach(({ title }) => {
            const t = localStorage.getItem(title);
            if (t) {
                const parsed = parseFloat(t);
                const m = Math.floor(parsed / 60);
                const s = Math.floor(parsed % 60);
                loaded[title] = `${m}:${s.toString().padStart(2, "0")} min`;
                completed.push({ title, time: parsed });
            } else {
                loaded[title] = "-- sec";
            }
        });

        setTimes(loaded);

        const finishedAll = completed.length === archetypes.length;
        setAllCompleted(finishedAll);

        if (finishedAll) {
            completed.sort((a, b) => a.time - b.time);
            setFastest(completed[0].title);
            setSubdominant(completed[1]?.title || null);

            /* ── celebration only once ─────────────────── */
            const alreadyShown = localStorage.getItem("archetype-shown") === "true";
            if (!alreadyShown) {
                setShowPopup(true);
                localStorage.setItem("archetype-shown", "true");
            }
        }
    }, []);

    /* ── navigation helpers ─────────────────────────── */
    const handleStart = (title: string) => router.push(`/game/${title.toLowerCase()}`);

    const handleReset = () => {
        archetypes.forEach(({ title }) => localStorage.removeItem(title));
        localStorage.removeItem("archetype-shown");   // allow pop‑up again on fresh run
        window.location.reload();
    };

    /* ── tiny util: bingo‑card button ───────────────── */
    const bingoBtn = (title: string): ReactNode => {
        if (typeof window === "undefined") return null;

        const complete = localStorage.getItem(`${title.toLowerCase()}_complete`) === "true";

        return allCompleted ? (
            <button
                disabled={complete}
                onClick={() => router.push(`/game/bingo/${title.toLowerCase()}`)}
                className={`mt-3 inline-block px-4 py-2 rounded font-medium focus:outline-none ${complete
                        ? "bg-gray-400 text-white cursor-not-allowed"
                        : "bg-green-600 text-white hover:bg-green-700 focus:ring-2 focus:ring-green-600"
                    }`}
            >
                View&nbsp;your&nbsp;Bingo&nbsp;Card
            </button>
        ) : null;
    };


    /* ── card renderer used in both grids ───────────── */
    const renderCard = (arc: (typeof archetypes)[number]) => {
        const isCompleted = times[arc.title] !== "-- sec";
        const isFastest = arc.title === fastest;

        const containerClass =
            isCompleted
                ? allCompleted
                    ? "bg-white text-white rounded-xl"   // undim when all done
                    : "opacity-50"                      // dim while still playing
                : "bg-white text-white rounded-xl";

        return (
            <div key={arc.title} className={containerClass}>
                <ArchetypeCard
                    /* FRONT FACE */
                    title={
                        <div className="flex flex-col items-center">
                            <div
                                className="text-xl font-semibold font-jaro"
                                style={{ color: isFastest ? "green" : isCompleted ? "#000000" : undefined }}
                            >
                                {arc.title}
                            </div>
                            <div className="flex items-center gap-2 text-sm mt-1">
                                <Image src="/timer-icon.png" alt="timer" width={16} height={16} />
                                <span>{times[arc.title]}</span>
                            </div>
                        </div>
                    }

                    /* BACK FACE */
                    description={
                        <div className="flex flex-col items-center text-center">
                            <p>{arc.description}</p>
                            {isCompleted && bingoBtn(arc.title)}
                        </div>
                    }

                    onStart={isCompleted ? undefined : () => handleStart(arc.title)}
                />
            </div>
        );
    };

    /* ──────────────────────────────────────────────── */
    /** Show hint if:
     *   1. all games are finished   AND
     *   2. the celebration pop‑up is NOT showing now
     */
    const showHint = allCompleted && !showPopup;

    return (
        <main className="min-h-screen flex flex-col items-center justify-center p-10 bg-white">
            <h1 className="text-5xl font-jaro mb-6 text-black">Learner Archetypes</h1>

            {/* hint shown on repeat visits */}
            {showHint && (
                <p className="mb-6 text-center text-gray-800 font-medium">
                    Flip each archetype card to view the Bingo&nbsp;Card.
                </p>
            )}

            {/* first four cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {archetypes.slice(0, 4).map(renderCard)}
            </div>

            {/* last three cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
                {archetypes.slice(4).map(renderCard)}
            </div>

            {/* reset displayed only when every game done */}
            {allCompleted && (
                <button
                    onClick={handleReset}
                    className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition"
                >
                    Reset All
                </button>
            )}

            {/* confetti + modal only first time */}
            {showPopup && <Confetti recycle={false} numberOfPieces={400} />}

            {showPopup && fastest && (
                <div
                    className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
                     z-50 bg-white shadow-lg rounded-xl px-10 py-6 text-center scale-150
                     border border-green-500"
                >
                    <h2 className="text-2xl font-bold text-green-600 mb-2">Your Archetype</h2>
                    <p className="text-lg font-semibold text-black mb-2">{fastest}</p>
                    {subdominant && (
                        <p className="text-sm text-gray-700 mb-4">
                            Your sub-dominant archetype is&nbsp;
                            <span className="font-semibold text-black">{subdominant}</span>
                        </p>
                    )}
                    <button
                        onClick={() => router.push(`/game/bingo/${fastest.toLowerCase()}`)}
                        className="mt-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                        Proceed to Your BingoCard
                    </button>
                </div>
            )}
        </main>
    );
}
