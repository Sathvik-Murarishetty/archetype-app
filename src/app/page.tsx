"use client";

import { useState } from "react";
import Link from "next/link";

export default function HomePage() {
  const [flipped, setFlipped] = useState<{ [key: string]: boolean }>({});

  const toggleFlip = (key: string) => {
    setFlipped((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="min-h-screen bg-black text-white px-6 py-12 flex flex-col items-center">
      <h1 className="text-4xl font-extrabold text-center mb-2">Skill up & Chill</h1>
      <p className="text-lg text-gray-300 text-center mb-6">
        Learn your style. Play your strengths.
      </p>

      <div className="max-w-3xl text-sm text-gray-300 text-center mb-12">
        <p className="mb-4 font-semibold">What’s this all about?</p>
        <p className="mb-4">
          This toolkit is a playful, interactive journey that helps you figure out how you learn best – and what skills you bring to the table.
          You’ll start by diving into quick mini-games representing 7 unique learning archetypes—from curious Explorers to goal-hungry Advancers.
          Whichever game you complete fastest? That’s your dominant archetype. Boom – Level 1 complete.
        </p>
        <p className="mb-4">
          Next, it’s time for Level 2: Your personal Transferable Skills Bingo. You’ll pick a card loaded with tasks linked to your archetype and
          12 core real-world skills – like communication, creativity, leadership, and adaptability.
        </p>
        <p className="mb-4">Each task is a mini-adventure. Finish a row, shout “Bingo!”, and rack up proof of your powers.</p>
        <p className="mb-4 font-semibold">The goal?</p>
        <p>
          To help you discover your learning superpowers and build a toolkit of skills that can take you anywhere—school, work, passion projects,
          or the next big idea.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {[
          {
            id: "archetypes",
            front: "Learner Archetypes",
            back: (
              <div className="text-center">
                <p className="text-sm mb-3">
                  Learner archetypes are unique profiles that capture how individuals naturally absorb, process,
                  and engage with learning based on their strengths and motivations.
                </p>
                <Link href="/game" className="inline-block mt-2 text-xs bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded">
                  Know your Archetype!!
                </Link>
              </div>
            ),
          },
          {
            id: "skills",
            front: "Transferable Skills",
            back: (
              <div className="text-sm text-center">
                Transferable skills are versatile abilities—like communication, problem-solving, or teamwork—that you can apply
                across different roles, careers, and life situations. They grow with you, no matter where you go.
              </div>
            ),
          },
        ].map((card) => (
          <div
            key={card.id}
            onMouseEnter={() => toggleFlip(card.id)}
            onMouseLeave={() => toggleFlip(card.id)}
            className="relative w-72 h-48 [perspective:1000px] cursor-default"
          >
            <div
              className={`absolute inset-0 transition-transform duration-500 [transform-style:preserve-3d] ${flipped[card.id] ? "rotate-y-180" : ""
                }`}
            >
              <div className="absolute inset-0 bg-white text-black rounded-lg flex items-center justify-center text-lg font-semibold [backface-visibility:hidden]">
                {card.front}
              </div>
              <div className="absolute inset-0 bg-gray-800 text-white rounded-lg p-4 flex flex-col items-center justify-center [backface-visibility:hidden] rotate-y-180">
                {card.back}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
