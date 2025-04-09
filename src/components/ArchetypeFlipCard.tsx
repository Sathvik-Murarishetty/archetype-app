"use client";

import React from "react";

type ArchetypeFlipCardProps = {
    name: string;
    time: number;
    description: string;
};

export default function ArchetypeFlipCard({ name, time, description }: ArchetypeFlipCardProps) {
    return (
        <div className="group [perspective:1000px] w-64 h-48 relative">
            <div className="relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                {/* Front side */}
                <div className="absolute w-full h-full bg-white border rounded-xl shadow-md flex flex-col items-center justify-center [backface-visibility:hidden]">
                    <h3 className="text-lg font-bold text-blue-600">{name}</h3>
                    <p className="text-md text-black mt-2">{time.toFixed(2)}s</p>
                </div>

                {/* Back side */}
                <div
                    className="absolute w-full h-full bg-blue-100 border rounded-xl shadow-md text-center flex flex-col items-center justify-center px-4 [transform:rotateY(180deg)] [backface-visibility:hidden]"
                >
                    <p className="text-sm text-gray-700">{description}</p>
                </div>
            </div>
        </div>
    );
}
