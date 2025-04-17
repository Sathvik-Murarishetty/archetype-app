"use client";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SortableItem from "@/components/SortableItem";
import Image from "next/image";
import type { DragStartEvent, DragEndEvent } from "@dnd-kit/core";

const allSteps = [
  "Decide the destination",
  "Take a nap before deciding anything",
  "Set the date and time of the trip",
  "Get permission or approvals (if needed)",
  "Watch a movie about travel",
  "Make a list of what to pack",
  "Arrange transport (bus, car, etc.)",
  "Inform all participants and share details",
  "Buy a new outfit just for photos",
  "Pack necessary items",
  "Leave for the trip",
  "Forget your charger and panic",
  "Enjoy activities at the destination",
  "Return home",
  "Unpack and rest",
  "Start planning your next trip while on this one",
];

const correctSequence = [
  "Decide the destination",
  "Set the date and time of the trip",
  "Get permission or approvals (if needed)",
  "Make a list of what to pack",
  "Arrange transport (bus, car, etc.)",
  "Inform all participants and share details",
  "Pack necessary items",
  "Leave for the trip",
  "Enjoy activities at the destination",
  "Return home",
  "Unpack and rest",
];

export default function PreparersGame() {
  const router = useRouter();
  const [startTime, setStartTime] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [showIntro, setShowIntro] = useState(true);
  const [pool, setPool] = useState(() => shuffle([...allSteps]));
  const [sequence, setSequence] = useState<string[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  const sensors = useSensors(useSensor(PointerSensor));

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (startTime) {
      timer = setInterval(() => {
        setCurrentTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [startTime]);

  function shuffle(array: string[]) {
    return array.sort(() => Math.random() - 0.5);
  }

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) {
      setActiveId(null);
      return;
    }

    const list = sequence;
    const oldIndex = list.indexOf(active.id as string);
    const newIndex = list.indexOf(over.id as string);

    if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
      const updated = arrayMove(sequence, oldIndex, newIndex);
      setSequence(updated);
      checkCompletion(updated);
    }

    setActiveId(null);
  }

  function checkCompletion(updated: string[]) {
    const filtered = updated.filter((step) => correctSequence.includes(step));
    if (
      filtered.length === correctSequence.length &&
      filtered.every((step, idx) => step === correctSequence[idx])
    ) {
      setIsCompleted(true);
      const totalTime = startTime ? (Date.now() - startTime) / 1000 : 0;
      localStorage.setItem("Preparers", totalTime.toString());
      setTimeout(() => {
        router.push("/game/");
      }, 1500);
    }
  }

  function resetGame() {
    setPool(shuffle([...allSteps]));
    setSequence([]);
    setIsCompleted(false);
    setStartTime(null);
    setCurrentTime(0);
  }

  if (showIntro) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg text-center md:w-[650px]">
          <h2 className="text-2xl font-bold mb-2 text-black">Preparers</h2>
          <h3 className="text-lg font-semibold mb-4 text-gray-700">The Planifestors</h3>
          <p className="text-sm text-gray-700 mb-4">
            Planifestors are dreamers with calendars. They set alarms for their dreams and make lists for their passions.
            They&apos;re prepping for college, side hustles, and their future dog all at once. Strategy is their comfort zone.
          </p>
          <div className="flex justify-center mb-4">
            <Image src="/preparers.png" alt="emoji" width={80} height={80} />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4 text-left">
            <div>
              <p className="text-sm font-bold text-black">STRENGTHS</p>
              <ul className="text-sm text-gray-700 list-disc list-inside">
                <li>Incredibly organised and structured</li>
                <li>Deep sense of purpose</li>
                <li>Great at long-term planning</li>
              </ul>
            </div>
            <div>
              <p className="text-sm font-bold text-black">WEAKNESSES</p>
              <ul className="text-sm text-gray-700 list-disc list-inside">
                <li>Can fear failure and procrastinate starting</li>
                <li>Gets thrown off when plans change</li>
                <li>May over-plan and under-execute</li>
              </ul>
            </div>
          </div>
          <p className="italic text-sm text-black mb-4">
            “Manifesting the life, planning the checklist.”
          </p>
          <button
            onClick={() => {
              setShowIntro(false);
              setStartTime(Date.now());
            }}
            className="bg-black text-white px-4 py-2 rounded"
          >
            Proceed
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center bg-white px-6 pt-10 pb-10">
      <div className="w-full max-w-xl mb-4 text-center">
        <p className="text-3xl font-medium text-black">Preparers Archetype</p>
      </div>

      <div className="flex items-center justify-between w-full max-w-xl mb-8">
        <div className="flex-grow bg-gray-200 h-3 rounded-full overflow-hidden mr-4">
          <div
            className="bg-blue-600 h-full transition-all duration-300"
            style={{ width: `100%` }}
          />
        </div>
        <span className="text-gray-700 text-sm font-semibold">1/1</span>
        <div className="flex items-center ml-6">
          <Image src="/timer-icon.png" alt="Timer" width={24} height={24} className="mr-2" />
          <span className="text-md font-semibold text-black">{currentTime}s</span>
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1">
            <h2 className="text-lg font-semibold mb-2 text-black">All Steps</h2>
            <div className="space-y-2 text-sm">
              {pool.map((step) => (
                <div
                  key={step}
                  onClick={() => {
                    if (!sequence.includes(step)) {
                      const updated = [...sequence, step];
                      setSequence(updated);
                      checkCompletion(updated);
                    }
                  }}
                  className="cursor-pointer p-2 border rounded bg-white text-black hover:bg-blue-50"
                >
                  {step}
                </div>
              ))}
            </div>
          </div>

          <div className="w-full md:w-[400px]">
            <h2 className="text-lg font-semibold mb-2 text-black">Your Trip Plan</h2>
            <SortableContext items={sequence} strategy={verticalListSortingStrategy}>
              <div className="space-y-2 border border-dashed rounded p-2 text-sm">
                {sequence.map((step) => (
                  <SortableItem key={step} id={step} />
                ))}
              </div>
            </SortableContext>
          </div>
        </div>

        <DragOverlay>
          {activeId ? (
            <div className="p-4 rounded border text-black bg-yellow-100 shadow w-full md:w-[400px]">
              {activeId}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      <div className="h-10" />
      <button
        onClick={resetGame}
        className="mt-6 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Reset
      </button>

      {isCompleted && (
        <p className="mt-6 text-green-600 font-semibold text-lg text-center">
          ✅ Great job! Trip planned perfectly!
        </p>
      )}
    </div>
  );
}
