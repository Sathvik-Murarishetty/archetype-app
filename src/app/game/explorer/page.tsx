"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const TOTAL_ITEMS = 30;

export default function ExplorerGame() {
    const router = useRouter();
    const [found, setFound] = useState<Set<string>>(new Set());
    const [startTime, setStartTime] = useState<number | null>(null);
    const [currentTime, setCurrentTime] = useState(0);
    const [countdown, setCountdown] = useState(3);
    const [showCountdown, setShowCountdown] = useState(true);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imageRefs = useRef<(HTMLImageElement | null)[]>([]);

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

    const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const scaleX = 800 / rect.width;
        const scaleY = 600 / rect.height;

        const x = (e.clientX - rect.left) * scaleX;
        const y = (e.clientY - rect.top) * scaleY;

        imageRefs.current.forEach((img) => {
            if (!img || found.has(img.alt)) return;

            const canvas = canvasRef.current;
            if (!canvas) return;
            const ctx = canvas.getContext("2d");
            if (!ctx) return;

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            const pixel = ctx.getImageData(x, y, 1, 1).data;
            if (pixel[3] > 10) {
                setFound((prev) => new Set(prev).add(img.alt));
            }
        });
    };

    useEffect(() => {
        if (found.size === TOTAL_ITEMS) {
            const totalTime = startTime ? (Date.now() - startTime) / 1000 : 0;
            localStorage.setItem("Explorer", totalTime.toString());
            router.push("/");
        }
    }, [found, startTime, router]);

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
                <p className="text-3xl font-medium text-black">Explorer Archetype</p>
            </div>

            <div className="flex items-center justify-between w-full max-w-xl mb-6">
                <div className="flex-grow bg-gray-200 h-3 rounded-full overflow-hidden mr-4">
                    <div
                        className="bg-green-500 h-full transition-all duration-300"
                        style={{ width: `${(found.size / TOTAL_ITEMS) * 100}%` }}
                    />
                </div>
                <span className="text-sm text-gray-700 font-semibold">
                    {found.size}/{TOTAL_ITEMS}
                </span>
                <div className="flex items-center ml-6">
                    <Image src="/timer-icon.png" alt="Timer" width={24} height={24} className="mr-2" />
                    <span className="text-md font-semibold text-black">{currentTime}s</span>
                </div>
            </div>

            <div
                className="relative w-full max-w-5xl overflow-hidden aspect-[3/2]"
                onClick={handleCanvasClick}
            >
                <Image src="/IMG_0372-1.png" alt="Background" fill className="object-contain w-full h-full" />

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
                            className={`absolute top-0 left-0 w-full h-full object-contain pointer-events-none transition duration-300 ${isFound ? "grayscale opacity-100" : ""}`}
                        />
                    );
                })}

                <canvas
                    ref={canvasRef}
                    width={800}
                    height={600}
                    className="hidden"
                />
            </div>

            <p className="mt-4 text-sm text-gray-600">Items Found: {found.size} / {TOTAL_ITEMS}</p>
        </div>
    );
}
