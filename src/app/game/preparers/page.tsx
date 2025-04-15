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

export default function PreparersLevel() {
  const router = useRouter();
  const [startTime, setStartTime] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [countdown, setCountdown] = useState(3);
  const [showCountdown, setShowCountdown] = useState(true);
  const [pool, setPool] = useState(() => shuffle([...allSteps]));
  const [sequence, setSequence] = useState<string[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  const sensors = useSensors(useSensor(PointerSensor));

  useEffect(() => {
    if (!showCountdown) return;

    const interval = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    if (countdown === 0) {
      clearInterval(interval);
      setShowCountdown(false);
      setStartTime(Date.now());
    }

    return () => clearInterval(interval);
  }, [countdown, showCountdown]);

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

  function handleDragStart(event: any) {
    setActiveId(event.active.id);
  }

  function handleDragEnd(event: any) {
    const { active, over } = event;
    if (!over) {
      setActiveId(null);
      return;
    }

    const list = sequence;
    const oldIndex = list.indexOf(active.id);
    const newIndex = list.indexOf(over.id);

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
        router.push("/");
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

  return (
    <div className="relative min-h-screen flex flex-col items-center bg-white px-6 pt-10 pb-10">
      {showCountdown && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
          <div className="text-white text-6xl font-bold animate-pulse">
            {countdown > 0 ? countdown : "Go!"}
          </div>
        </div>
      )}

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
            <div className="space-y-2">
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
              <div className="space-y-2 min-h-[300px] border border-dashed rounded p-2">
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
