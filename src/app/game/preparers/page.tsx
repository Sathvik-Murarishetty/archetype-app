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

function shuffle<T>(array: T[]): T[] {
  return [...array].sort(() => Math.random() - 0.5);
}

export default function PreparersGame() {
  const router = useRouter();
  const [startTime, setStartTime] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [showIntro, setShowIntro] = useState(true);

  const [sequence, setSequence] = useState<string[]>(() => shuffle(correctSequence));
  const [activeId, setActiveId] = useState<string | null>(null);

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

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) {
      setActiveId(null);
      return;
    }
    const oldIndex = sequence.indexOf(active.id as string);
    const newIndex = sequence.indexOf(over.id as string);
    if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
      setSequence(arrayMove(sequence, oldIndex, newIndex));
    }
    setActiveId(null);
  }

  function handleSubmit() {
    const totalTime = startTime ? (Date.now() - startTime) / 1000 : 0;
    localStorage.setItem("Preparers", totalTime.toString());
    router.push("/game/");
  }

  if (showIntro) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg text-center w-[90%] max-w-md p-4">
          <Image
            src="/preparers-popup.jpg"
            alt="Preparers Info"
            width={400}
            height={300}
            className="w-full h-auto object-cover rounded-md mb-4"
          />
          <button
            onClick={() => {
              setShowIntro(false);
              setStartTime(Date.now());
            }}
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
          >
            Proceed
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center bg-black text-white px-6 pt-10 pb-10">
      <div className="w-full max-w-xl mb-4 text-center">
        <p className="font-jaro text-5xl font-medium text-white">Preparers Archetype</p>
      </div>

      <div className="w-full max-w-xl mb-8 flex items-center justify-between">
        <div className="flex-grow bg-gray-700 h-3 rounded-full overflow-hidden mr-4">
          <div className="bg-blue-500 h-full" />
        </div>
        <span className="text-gray-300 text-sm font-semibold">1/1</span>
        <div className="flex items-center ml-6">
          <Image src="/timer-icon.png" alt="Timer" width={24} height={24} className="mr-2" />
          <span className="text-md font-semibold text-white">{currentTime}s</span>
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="w-full max-w-xl mx-auto">
          <h2 className="text-2xl font-semibold mb-4 text-white text-center">Arrange the sequence in the right order</h2>
          <h2 className="text-md font-semibold mb-4 text-white text-center">Your Trip Plan</h2>
          <SortableContext items={sequence} strategy={verticalListSortingStrategy}>
            <div className="space-y-2 bg-gray-800 p-4 rounded border border-white">
              {sequence.map((step) => (
                <SortableItem key={step} id={step} className="text-black bg-gray-700 p-2 rounded" />
              ))}
            </div>
          </SortableContext>
        </div>
        <DragOverlay>
          {activeId ? (
            <div className="p-4 rounded border border-white bg-gray-700 text-white w-full max-w-md">
              {activeId}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      <button
        onClick={handleSubmit}
        className="mt-6 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        Complete
      </button>
    </div>
  );
}