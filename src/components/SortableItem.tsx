"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type SortableItemProps = {
    id: string;
    className?: string;
};

export default function SortableItem({ id, className }: SortableItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={`p-3 rounded border text-black bg-white shadow cursor-grab flex justify-between items-center ${isDragging ? "opacity-50" : ""
                }${className ?? ""}`}
        >
            <span>{id}</span>
        </div>
    );
}
