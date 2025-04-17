"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const IMG_W = 1199;
const IMG_H = 1598;
const TOTAL_ITEMS = 30;

const CATEGORIES = [
    { name: "Cactus", start: 2, end: 12, thumb: "/thumbs/Cactus.png" },
    { name: "Grass", start: 13, end: 18, thumb: "/thumbs/Grass.png" },
    { name: "Flower", start: 19, end: 23, thumb: "/thumbs/Flower.png" },
    { name: "Haystack", start: 24, end: 31, thumb: "/thumbs/haystack.png" },
] as const;

export default function ExplorerGame() {
    const router = useRouter();
    const [found, setFound] = useState<Set<string>>(new Set());
    const [startTime, setStartTime] = useState<number | null>(null);
    const [currentTime, setCurrentTime] = useState(0);
    const [showIntro, setShowIntro] = useState(true);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imageRefs = useRef<(HTMLImageElement | null)[]>([]);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (startTime) {
            timer = setInterval(() => {
                setCurrentTime(Math.floor((Date.now() - startTime) / 1000));
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [startTime]);

    const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const canvas = canvasRef.current;
        if (!canvas) return;

        const x = ((e.clientX - rect.left) * IMG_W) / rect.width;
        const y = ((e.clientY - rect.top) * IMG_H) / rect.height;

        const ctx = canvas.getContext("2d")!;
        for (const img of imageRefs.current) {
            if (!img || found.has(img.alt)) continue;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            if (ctx.getImageData(x, y, 1, 1).data[3] > 10) {
                setFound((prev) => new Set(prev).add(img.alt));
                break;
            }
        }
    };

    useEffect(() => {
        if (found.size === TOTAL_ITEMS) {
            const total = startTime ? (Date.now() - startTime) / 1000 : 0;
            localStorage.setItem("Explorer", total.toString());
            router.push("/game/");
        }
    }, [found, startTime, router]);

    const categoryState = useMemo(() =>
        CATEGORIES.map((cat) => {
            const ids = Array.from(
                { length: cat.end - cat.start + 1 },
                (_, i) => `IMG_0372-${cat.start + i}.png`
            );
            return {
                name: cat.name,
                total: ids.length,
                found: ids.filter((id) => found.has(id)).length,
                thumb: cat.thumb ?? `/${ids[0]}`,
            };
        }),
        [found]
    );

    if (showIntro) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg shadow-lg text-center md:w-[650px]">
                    <div className="flex flex-col md:flex-row md:items-start md:text-left md:space-x-6">
                        <Image src="/explorer.png" alt="emoji" width={120} height={120} className="mx-auto md:mx-0" />
                        <div>
                            <h2 className="text-2xl font-bold mb-1 text-black">Explorers</h2>
                            <h3 className="text-lg font-semibold mb-3 text-gray-700">The Wanderminds</h3>
                            <p className="text-sm text-gray-700 mb-4">
                                Wanderminds follow questions wherever they go. Learning is their adventure, and they collect facts like souvenirs. They love connecting dots, shifting fields, and discovering random passions.
                            </p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-4 mb-4 text-left">
                        <div>
                            <p className="text-sm font-bold text-black">STRENGTHS</p>
                            <ul className="text-sm text-gray-700 list-disc list-inside">
                                <li>Exceptionally curious and open-minded</li>
                                <li>Great at cross-disciplinary thinking</li>
                                <li>Energetic and inspiring</li>
                            </ul>
                        </div>
                        <div>
                            <p className="text-sm font-bold text-black">WEAKNESSES</p>
                            <ul className="text-sm text-gray-700 list-disc list-inside">
                                <li>Often leaves projects unfinished</li>
                                <li>Struggles with focus or follow-through</li>
                                <li>Can be overwhelmed by options</li>
                            </ul>
                        </div>
                    </div>
                    <p className="italic text-sm text-black mb-4">
                        “I got lost in a rabbit hole and came out with a PhD in vibes.”
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
                <p className="text-3xl font-medium text-black">Explorer Archetype</p>
            </div>

            <div className="flex items-center justify-between w-full max-w-xl">
                <div className="flex-grow bg-gray-200 h-3 rounded-full overflow-hidden mr-4">
                    <div
                        className="bg-green-500 h-full transition-all duration-300"
                        style={{ width: `${(found.size / TOTAL_ITEMS) * 100}%` }}
                    />
                </div>
                <div className="flex items-center">
                    <Image src="/timer-icon.png" alt="Timer" width={24} height={24} className="mr-2" />
                    <span className="text-md font-semibold text-black">{currentTime}s</span>
                </div>
            </div>

            <div className="w-full max-w-xl mt-4 grid grid-cols-2 gap-4">
                {categoryState.map((c) => (
                    <div key={c.name} className="flex items-center space-x-2">
                        <Image src={c.thumb} alt={c.name} width={40} height={40} className="rounded border" />
                        <span className="text-sm font-medium text-black">
                            {c.name}: {c.found}/{c.total}
                        </span>
                    </div>
                ))}
            </div>

            <div
                className="relative w-full max-w-5xl overflow-hidden mt-6"
                style={{ aspectRatio: `${IMG_W} / ${IMG_H}` }}
                onClick={handleCanvasClick}
            >
                <Image src="/IMG_0372-1.png" alt="Background" fill className="object-contain" />

                {Array.from({ length: TOTAL_ITEMS }, (_, i) => {
                    const id = `IMG_0372-${i + 2}.png`;
                    const isFound = found.has(id);
                    return (
                        <img
                            ref={(el) => {
                                imageRefs.current[i] = el;
                            }}
                            key={id}
                            src={`/${id}`}
                            alt={id}
                            className="absolute inset-0 w-full h-full object-contain pointer-events-none transition-opacity duration-300"
                            style={
                                isFound
                                    ? { opacity: 0.85, filter: "brightness(0) saturate(100%)" }
                                    : { opacity: 0 }
                            }
                        />
                    );
                })}

                <canvas ref={canvasRef} width={IMG_W} height={IMG_H} className="hidden" />
            </div>
        </div>
    );
}
