"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import useSound from "use-sound";

const SIZE = 6;

const levelConfigs = [
    {
        blue: [
            { row: 0, col: 3 },
            { row: 1, col: 5 },
        ],
        yellow: [
            { row: 0, col: 5 },
            { row: 2, col: 3 },
        ],
        red: [
            { row: 2, col: 2 },
            { row: 4, col: 4 },
        ],
        green: [
            { row: 1, col: 3 },
            { row: 4, col: 3 },
        ],
    },
    {
        blue: [
            { row: 0, col: 0 },
            { row: 1, col: 1 },
        ],
        red: [
            { row: 0, col: 1 },
            { row: 2, col: 1 },
        ],
        yellow: [
            { row: 2, col: 0 },
            { row: 1, col: 4 },
        ],
        green: [
            { row: 3, col: 1 },
            { row: 5, col: 0 },
        ],
    },
    {
        blue: [
            { row: 0, col: 5 },
            { row: 4, col: 3 },
        ],
        yellow: [
            { row: 2, col: 1 },
            { row: 3, col: 5 },
        ],
        red: [
            { row: 2, col: 2 },
            { row: 4, col: 4 },
        ],
        green: [
            { row: 4, col: 1 },
            { row: 3, col: 3 },
        ],
    },
];

let level = 0;
let initialPoints = levelConfigs[level];

const createEmptyGrid = () =>
    Array(SIZE)
        .fill(null)
        .map(() => Array(SIZE).fill(null));

export default function FlowBoard({ onLevelComplete, onProgress }: { onLevelComplete?: () => void; onProgress?: (percent: number) => void }) {
    const [grid, setGrid] = useState(() => createEmptyGrid());
    const [currentColor, setCurrentColor] = useState<string | null>(null);
    const [path, setPath] = useState<{ row: number; col: number }[]>([]);
    const [completedColors, setCompletedColors] = useState<string[]>([]);
    const [pathsByColor, setPathsByColor] = useState<Record<string, { row: number; col: number }[]>>({});
    const [playConnect] = useSound("/sounds/connect.mp3", { volume: 0.5 });
    const [playWin] = useSound("/sounds/complete.mp3", { volume: 0.5 });

    const isStartOrEndPoint = (row: number, col: number) => {
        for (const [color, [start, end]] of Object.entries(initialPoints)) {
            if ((start.row === row && start.col === col) || (end.row === row && end.col === col)) {
                return color;
            }
        }
        return null;
    };

    const handleMouseDown = (row: number, col: number) => {
        const color = isStartOrEndPoint(row, col);
        if (color) {
            setCurrentColor(color);
            setPath([{ row, col }]);
        }
    };

    const handleMouseEnter = (row: number, col: number) => {
        if (!currentColor || completedColors.includes(currentColor)) return;
        const last = path[path.length - 1];
        const alreadyInPath = path.some((p) => p.row === row && p.col === col);
        const isAdjacent = Math.abs(last.row - row) + Math.abs(last.col - col) === 1;
        if (!isAdjacent || alreadyInPath) return;

        const newPath = [...path, { row, col }];
        const newGrid = grid.map((r) => [...r]);

        const overlappedColor = newGrid[row][col];
        if (overlappedColor && overlappedColor !== currentColor) {
            setPathsByColor((prev) => {
                const updated = { ...prev };
                delete updated[overlappedColor];
                return updated;
            });
            for (let r = 0; r < SIZE; r++) {
                for (let c = 0; c < SIZE; c++) {
                    if (newGrid[r][c] === overlappedColor) {
                        newGrid[r][c] = null;
                    }
                }
            }
        }

        for (let r = 0; r < SIZE; r++) {
            for (let c = 0; c < SIZE; c++) {
                if (newGrid[r][c] === currentColor && !completedColors.includes(currentColor)) {
                    newGrid[r][c] = null;
                }
            }
        }

        for (const cell of newPath) {
            newGrid[cell.row][cell.col] = currentColor;
        }

        setPath(newPath);
        setGrid(newGrid);
    };

    const handleMouseUp = () => {
        if (!currentColor) return;

        const [start, end] = initialPoints[currentColor];
        const isComplete =
            path.some((p) => p.row === start.row && p.col === start.col) &&
            path.some((p) => p.row === end.row && p.col === end.col);

        if (isComplete && !completedColors.includes(currentColor)) {
            playConnect();
            const updated = [...completedColors, currentColor];
            setCompletedColors(updated);
            setPathsByColor((prev) => ({ ...prev, [currentColor]: [...path] }));
            if (onProgress) {
                const percent = (updated.length / Object.keys(initialPoints).length) * 100;
                onProgress(percent);
            }
        }

        setCurrentColor(null);
        setPath([]);
    };

    useEffect(() => {
        if (Object.keys(initialPoints).every((color) => completedColors.includes(color))) {
            playWin();
            if (onLevelComplete) onLevelComplete();
        }
    }, [completedColors, playWin]);

    return (
        <div className="relative">
            <svg
                className="absolute top-0 left-0 z-30 pointer-events-none"
                width="100%"
                height="100%"
            >
                {Object.entries(pathsByColor).map(([color, points]) =>
                    points.map((pt, idx) =>
                        idx < points.length - 1 ? (
                            <line x1={(pt.col * 66) + 30} y1={(pt.row * 66) + 30} x2={(points[idx + 1].col * 66) + 30} y2={(points[idx + 1].row * 66) + 30} stroke={color} strokeWidth={20} strokeLinecap="round" />
                        ) : null
                    )
                )}
            </svg>

            <div
                className="grid relative z-10"
                style={{ gridTemplateColumns: `repeat(${SIZE}, 60px)`, gap: "6px" }}
                onMouseLeave={handleMouseUp}
            >
                {grid.map((rowArr, rowIdx) =>
                    rowArr.map((cellColor, colIdx) => {
                        const isAnchor = isStartOrEndPoint(rowIdx, colIdx);
                        const bgColor = isAnchor || cellColor ? isAnchor || cellColor : "white";
                        const isDot = isAnchor !== null;

                        return (
                            <motion.div
                                key={`${rowIdx}-${colIdx}`}
                                onMouseDown={() => handleMouseDown(rowIdx, colIdx)}
                                onMouseEnter={() => handleMouseEnter(rowIdx, colIdx)}
                                onMouseUp={handleMouseUp}
                                className={`w-[60px] h-[60px] border rounded-full flex items-center justify-center cursor-pointer ${bgColor !== "white" ? "shadow-md" : ""
                                    }`}
                                style={{ backgroundColor: bgColor }}
                                layout
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                {isDot && <div className="w-4 h-4 rounded-full bg-white border border-black" />}
                            </motion.div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
