"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const COLORS = ["red", "blue", "green", "orange"];
const SIZE = 5;

const initialPoints = {
    red: [
        { row: 0, col: 0 },
        { row: 4, col: 4 },
    ],
    blue: [
        { row: 0, col: 4 },
        { row: 4, col: 0 },
    ],
    green: [
        { row: 0, col: 2 },
        { row: 4, col: 2 },
    ],
    orange: [
        { row: 2, col: 0 },
        { row: 2, col: 4 },
    ],
};

const createEmptyGrid = () =>
    Array(SIZE)
        .fill(null)
        .map(() => Array(SIZE).fill(null));

export default function FlowBoard() {
    const [grid, setGrid] = useState(() => createEmptyGrid());
    const [currentColor, setCurrentColor] = useState<string | null>(null);
    const [path, setPath] = useState<{ row: number; col: number }[]>([]);

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
        if (!currentColor) return;
        const last = path[path.length - 1];
        const alreadyInPath = path.some((p) => p.row === row && p.col === col);
        const isAdjacent = Math.abs(last.row - row) + Math.abs(last.col - col) === 1;
        if (!isAdjacent || alreadyInPath) return;

        const newPath = [...path, { row, col }];
        const newGrid = createEmptyGrid();

        for (const cell of newPath) {
            newGrid[cell.row][cell.col] = currentColor;
        }

        setPath(newPath);
        setGrid(newGrid);
    };

    const handleMouseUp = () => {
        setCurrentColor(null);
        setPath([]);
    };

    return (
        <div
            className="grid"
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
    );
}
