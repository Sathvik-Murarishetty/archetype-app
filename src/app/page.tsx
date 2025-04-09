"use client";

import { useRouter } from "next/navigation";
import ArchetypeCard from "../components/ArchetypeCard";

const archetypes = [
  { title: "Advancer", description: "Motivated by progress and time-based challenge" },
  { title: "Fixer", description: "Solves problems with precision" },
  { title: "Explorer", description: "Curious, trial-and-error learner" },
  { title: "Preparers", description: "Plans everything in advance" },
  { title: "Flourishers", description: "Loves creativity and patterns" },
  { title: "Vitalizers", description: "Quick, energetic responder" },
  { title: "Hobbyists", description: "Enjoys learning through play" },
];

export default function Home() {
  const router = useRouter();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-10 bg-white">
      <h1 className="text-4xl font-bold mb-10 text-black">7 Learning Archetypes</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {archetypes.slice(0, 4).map((arc) => (
          <ArchetypeCard
            key={arc.title}
            title={arc.title}
            description={arc.description}
          />
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        {archetypes.slice(4).map((arc) => (
          <ArchetypeCard
            key={arc.title}
            title={arc.title}
            description={arc.description}
          />
        ))}
      </div>
      <button
        className="bg-blue-600 text-white px-8 py-4 rounded-lg text-xl hover:bg-blue-700 transition"
        onClick={() => router.push("/game/advancer")}
      >
        Start
      </button>
    </main>
  );
}
