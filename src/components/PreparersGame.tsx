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
import { useState } from "react";
import { useRouter } from "next/navigation";
import SortableItem from "./SortableItem";

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

export default function PreparersTripPlanner() {
    const router = useRouter();
    const [pool, setPool] = useState(() => shuffle([...allSteps]));
    const [sequence, setSequence] = useState<string[]>([]);
    const [activeId, setActiveId] = useState<string | null>(null);
    const [isCompleted, setIsCompleted] = useState(false);

    const sensors = useSensors(useSensor(PointerSensor));

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

        if (active.id !== over.id) {
            const oldIndex = sequence.indexOf(active.id);
            const newIndex = sequence.indexOf(over.id);
            setSequence((items) => arrayMove(items, oldIndex, newIndex));
        }

        const filtered = sequence.filter((step) => correctSequence.includes(step));
        if (
            filtered.length === correctSequence.length &&
            filtered.every((step, idx) => step === correctSequence[idx])
        ) {
            setTimeout(() => {
                localStorage.setItem("Preparers", "done");
                router.push("/game/flourishers");
            }, 1000);
            setIsCompleted(true);
        }

        setActiveId(null);
    }

    function handleItemDrop(id: string) {
        if (pool.includes(id)) {
            setPool(pool.filter((item) => item !== id));
            setSequence([...sequence, id]);
        }
    }

    return (
        <div className="w-full max-w-5xl">
            <h2 className="text-red-600 font-bold mb-4">Preparers Game Loaded</h2>
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
                                    className="p-3 rounded border text-black bg-gray-100 shadow cursor-pointer"
                                    onClick={() => handleItemDrop(step)}
                                >
                                    {step}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex-1">
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
                        <div className="p-3 rounded border text-black bg-yellow-100 shadow">
                            {activeId}
                        </div>
                    ) : null}
                </DragOverlay>
            </DndContext>

            {isCompleted && (
                <p className="mt-6 text-green-600 font-semibold text-lg text-center">
                    ✅ Great job! Trip planned perfectly!
                </p>
            )}
        </div>
    );
}
