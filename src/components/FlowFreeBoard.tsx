"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import useSound from "use-sound";

export default function FlowFreeBoard({
    gridSize,
    colorPairs,
    onComplete,
}: {
    gridSize: number;
    colorPairs: {
        color: string;
        from: [number, number];
        to: [number, number];
    }[];
    onComplete?: () => void;
}) {
    const [grid, setGrid] = useState(() => {
        const initialGrid = Array(gridSize)
            .fill(null)
            .map(() => Array(gridSize).fill(null));
        colorPairs.forEach(({ color, from, to }) => {
            initialGrid[from[0]][from[1]] = color;
            initialGrid[to[0]][to[1]] = color;
        });
        return initialGrid;
    });
    const [currentColor, setCurrentColor] = useState<string | null>(null);
    const [path, setPath] = useState<{ row: number; col: number }[]>([]);
    const [completedColors, setCompletedColors] = useState<string[]>([]);
    const [pathsByColor, setPathsByColor] = useState<Record<string, { row: number; col: number }[]>>({});
    const [playConnect] = useSound("/sounds/connect.mp3", { volume: 0.5 });
    const [playWin] = useSound("/sounds/complete.mp3", { volume: 0.5 });

    const isStartOrEndPoint = (row: number, col: number) => {
        for (const { color, from, to } of colorPairs) {
            if ((from[0] === row && from[1] === col) || (to[0] === row && to[1] === col)) {
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
        const isAnchor = colorPairs.some(({ from, to }) =>
            (from[0] === row && from[1] === col) || (to[0] === row && to[1] === col)
        );

        if (isAnchor && overlappedColor !== currentColor) return;

        if (overlappedColor && overlappedColor !== currentColor) {
            if (completedColors.includes(overlappedColor)) {
                setPathsByColor((prev) => {
                    const updated = { ...prev };
                    delete updated[overlappedColor];
                    return updated;
                });
                for (let r = 0; r < gridSize; r++) {
                    for (let c = 0; c < gridSize; c++) {
                        const keepAnchor = colorPairs.some(({ color, from, to }) =>
                            color === overlappedColor &&
                            ((from[0] === r && from[1] === c) || (to[0] === r && to[1] === c))
                        );
                        if (!keepAnchor && newGrid[r][c] === overlappedColor) {
                            newGrid[r][c] = null;
                        }
                    }
                }
                setCompletedColors((prev) => prev.filter((c) => c !== overlappedColor));
            } else {
                setPathsByColor((prev) => {
                    const updated = { ...prev };
                    delete updated[overlappedColor];
                    return updated;
                });
                for (let r = 0; r < gridSize; r++) {
                    for (let c = 0; c < gridSize; c++) {
                        if (newGrid[r][c] === overlappedColor) {
                            newGrid[r][c] = null;
                        }
                    }
                }
            }
        }

        for (let r = 0; r < gridSize; r++) {
            for (let c = 0; c < gridSize; c++) {
                const isStartOrEnd = colorPairs.some(({ color, from, to }) =>
                    color === currentColor &&
                    ((from[0] === r && from[1] === c) || (to[0] === r && to[1] === c))
                );
                if (newGrid[r][c] === currentColor && !isStartOrEnd) {
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

        const { from, to } = colorPairs.find((c) => c.color === currentColor)!;
        const isComplete =
            path.some((p) => p.row === from[0] && p.col === from[1]) &&
            path.some((p) => p.row === to[0] && p.col === to[1]);

        if (isComplete && !completedColors.includes(currentColor)) {
            playConnect();
            const updated = [...completedColors, currentColor];
            setCompletedColors(updated);
            setPathsByColor((prev) => ({ ...prev, [currentColor]: [...path] }));
        }

        setCurrentColor(null);
        setPath([]);
    };

    useEffect(() => {
        const allColors = colorPairs.map((c) => c.color);
        const allConnected = allColors.every((color) => {
            const path = pathsByColor[color];
            const { from, to } = colorPairs.find((c) => c.color === color)!;
            if (!path) return false;
            const hasFrom = path.some((p) => p.row === from[0] && p.col === from[1]);
            const hasTo = path.some((p) => p.row === to[0] && p.col === to[1]);
            return hasFrom && hasTo;
        });

        if (allConnected) {
            playWin();
            if (onComplete) onComplete();
        }
    }, [pathsByColor]);

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
                            <line
                                key={`${color}-${idx}`}
                                x1={pt.col * 66 + 30}
                                y1={pt.row * 66 + 30}
                                x2={points[idx + 1].col * 66 + 30}
                                y2={points[idx + 1].row * 66 + 30}
                                stroke={color}
                                strokeWidth={20}
                                strokeLinecap="round"
                            />
                        ) : null
                    )
                )}
            </svg>

            <div
                className="grid relative z-10"
                style={{ gridTemplateColumns: `repeat(${gridSize}, 60px)`, gap: "6px" }}
                onMouseLeave={handleMouseUp}
            >
                {grid.map((rowArr, rowIdx) =>
                    rowArr.map((cellColor, colIdx) => {
                        const isAnchor = colorPairs.some(
                            ({ from, to }) =>
                                (from[0] === rowIdx && from[1] === colIdx) ||
                                (to[0] === rowIdx && to[1] === colIdx)
                        );
                        const bgColor = cellColor || "white";

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
                                {isAnchor && <div className="w-4 h-4 rounded-full bg-white border border-black" />}
                            </motion.div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
