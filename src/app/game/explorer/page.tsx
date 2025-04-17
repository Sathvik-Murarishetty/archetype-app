"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

// native size of IMG_0372‑1.png + item PNGs
const IMG_W = 1199;
const IMG_H = 1598;
const TOTAL_ITEMS = 30;

/* ── groups shown under the progress bar ─────────────── */
const CATEGORIES = [
    { name: "Cactus", start: 2, end: 12, thumb: "/thumbs/cactus.png" }, // 11 items
    { name: "Grass", start: 13, end: 18, thumb: "/thumbs/grass.png" }, //  6 items
    { name: "Flower", start: 19, end: 23, thumb: "/thumbs/flower.png" }, //  5 items
    { name: "Haystack", start: 24, end: 31, thumb: "/thumbs/haystack.png" }, //  8 items
] as const;

export default function ExplorerGame() {
    const router = useRouter();
    const [found, setFound] = useState<Set<string>>(new Set());
    const [startTime, setStartTime] = useState<number | null>(null);
    const [currentTime, setCurrentTime] = useState(0);
    const [countdown, setCountdown] = useState(3);
    const [showCountdown, setShowCountdown] = useState(true);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imageRefs = useRef<(HTMLImageElement | null)[]>([]);

    /* countdown */
    useEffect(() => {
        if (!showCountdown) return;
        const id = setInterval(() => setCountdown((c) => c - 1), 1000);
        if (countdown === 0) {
            clearInterval(id);
            setShowCountdown(false);
            setStartTime(Date.now());
        }
        return () => clearInterval(id);
    }, [countdown, showCountdown]);

    /* timer */
    useEffect(() => {
        if (!startTime) return;
        const id = setInterval(
            () => setCurrentTime(Math.floor((Date.now() - startTime) / 1000)),
            1000
        );
        return () => clearInterval(id);
    }, [startTime]);

    /* click detection */
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

    /* finish */
    useEffect(() => {
        if (found.size === TOTAL_ITEMS) {
            const total = startTime ? (Date.now() - startTime) / 1000 : 0;
            localStorage.setItem("Explorer", total.toString());
            router.push("/");
        }
    }, [found, startTime, router]);

    /* per‑category progress */
    /* per‑category progress */
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
                thumb: cat.thumb ?? `/${ids[0]}`,   // <-- use custom thumb if provided
            };
        }),
        [found]);


    return (
        <div className="relative min-h-screen flex flex-col items-center bg-white px-6 pt-10 pb-10">
            {/* countdown overlay */}
            {showCountdown && (
                <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
                    <div className="text-white text-6xl font-bold animate-pulse">
                        {countdown > 0 ? countdown : "Go!"}
                    </div>
                </div>
            )}

            {/* heading */}
            <div className="w-full max-w-xl mb-4 text-center">
                <p className="text-3xl font-medium text-black">Explorer Archetype</p>
            </div>

            {/* progress bar + timer */}
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

            {/* category thumbs */}
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

            {/* game board */}
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
