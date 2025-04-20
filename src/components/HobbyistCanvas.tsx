"use client";

import {
    useRef,
    useEffect,
    useState,
    forwardRef,
    useImperativeHandle
} from "react";
import { FaPaintBrush, FaEraser, FaPalette } from "react-icons/fa";

export type HobbyistCanvasRef = {
    clearCanvas: () => void;
};

type HobbyistCanvasProps = {
    onDraw?: () => void;
};

const HobbyistCanvas = forwardRef<HobbyistCanvasRef, HobbyistCanvasProps>(
    ({ onDraw }, ref) => {
        const canvasRef = useRef<HTMLCanvasElement>(null);
        const [isDrawing, setIsDrawing] = useState(false);
        const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
        const [tool, setTool] = useState<'pen' | 'eraser'>('pen');
        const [color, setColor] = useState('#000000');
        const [hasDrawn, setHasDrawn] = useState(false);

        useEffect(() => {
            if (canvasRef.current) {
                const ctx = canvasRef.current.getContext("2d");
                if (ctx) {
                    ctx.lineCap = "round";
                    ctx.lineWidth = 4;
                    setContext(ctx);
                }
            }
        }, []);

        useEffect(() => {
            if (context) {
                context.strokeStyle = tool === 'pen' ? color : '#ffffff';
            }
        }, [tool, color, context]);

        useImperativeHandle(ref, () => ({
            clearCanvas() {
                if (canvasRef.current && context) {
                    context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
                    setHasDrawn(false);
                }
            }
        }));

        const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
            if (!context) return;
            context.beginPath();
            context.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
            setIsDrawing(true);
        };

        const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
            if (!isDrawing || !context) return;
            context.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
            context.stroke();
            if (!hasDrawn) {
                setHasDrawn(true);
                onDraw?.();
            }
        };

        const stopDrawing = () => {
            if (!context) return;
            context.closePath();
            setIsDrawing(false);
        };

        const clearCanvas = () => {
            if (canvasRef.current && context) {
                context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
                setHasDrawn(false);
            }
        };

        return (
            <div className="flex flex-col items-center gap-4">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setTool('pen')}
                        className={`flex items-center gap-2 px-4 py-2 rounded ${tool === 'pen' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}
                    >
                        <FaPaintBrush /> Pen
                    </button>
                    <button
                        onClick={() => setTool('eraser')}
                        className={`flex items-center gap-2 px-4 py-2 rounded ${tool === 'eraser' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}
                    >
                        <FaEraser /> Eraser
                    </button>
                    <label className="flex items-center gap-2">
                        <FaPalette className="text-xl text-white" />
                        <input
                            type="color"
                            value={color}
                            onChange={(e) => setColor(e.target.value)}
                            className="w-8 h-8 rounded border border-gray-300 cursor-pointer"
                            title="Choose color"
                        />
                    </label>
                </div>

                <canvas
                    ref={canvasRef}
                    width={500}
                    height={400}
                    className="border border-gray-400 rounded-md cursor-crosshair bg-white"
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                />

                <button
                    onClick={clearCanvas}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                    Clear
                </button>
            </div>
        );
    }
);

HobbyistCanvas.displayName = 'HobbyistCanvas';
export default HobbyistCanvas;
