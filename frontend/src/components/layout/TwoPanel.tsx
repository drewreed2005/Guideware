/* 
 * src/components/layout/TwoPanel.tsx
 * 
 * Defines the behavior of the two-panel structure when viewing a Guideware guide, including the
 * divider's behavior, through:
 * - TwoPanelProps interface: outlines the attributes of the two-panel structure for the
 *                            following function
 * - TwoPanel function: defines interactions with the two panels and associates them with the
 *                      physical div structure
 */

import { useCallback, useEffect, useRef, useState } from "react";

const DEFAULT_SPLIT_PERCENT: number = 30;
const DEFAULT_MIN_PERCENT: number = 15;
const DEFAULT_MAX_PERCENT: number = 60


interface TwoPanelProps {
    left: React.ReactNode;
    right: React.ReactNode;
    initialSplitPercent?: number;
    minPercent?: number;
    maxPercent?: number;
}


export function TwoPanel({
    left, right,
    initialSplitPercent = DEFAULT_SPLIT_PERCENT,
    minPercent = DEFAULT_MIN_PERCENT,
    maxPercent = DEFAULT_MAX_PERCENT
}: TwoPanelProps) {
    const [splitPercent, setSplitPercent] = useState(initialSplitPercent);
    const dragging = useRef(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const onMouseDown = useCallback(() => {
        dragging.current = true;
        document.body.style.cursor = "col-resize";
        document.body.style.userSelect = "none";
        // (prevents text selection while dragging)
    }, []); // defined on page load

    const onMouseMove = useCallback((e: MouseEvent) => {
        if (!dragging.current || !containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const rawPercent = ((e.clientX - rect.left) / rect.width) * 100;
        setSplitPercent(Math.min(maxPercent, Math.max(minPercent, rawPercent)));
    }, [minPercent, maxPercent]);

    const onMouseUp = useCallback(() => {
        dragging.current = false;
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
    }, []);

    useEffect(() => {
        // event listener is tied to the document itself so dragging can continue outside the divider
        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);

        // cleaning up listeners to prevent memory leakage
        return () => {
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
        };
    }, [onMouseMove, onMouseUp]);

    return (
        <div
            ref={containerRef}
            style={{
                display: "flex",
                height: "100vh",
                overflow: "hidden"
            }}
        >
            {/* left panel*/}
            <div
                style={{
                    width: `${splitPercent}%`,
                    overflowY: "auto",
                    overflowX: "hidden",
                }}
            >
                {left}
            </div>

            {/* draggable divider */}
            <div
                onMouseDown={onMouseDown}
                style={{
                    width: "5px",
                    cursor: "col-resize",
                    backgroundColor: "#ddd",
                    flexShrink: 0,
                    transition: "background-color 0.15s",
                }}
                onMouseEnter={e => {
                    (e.target as HTMLDivElement).style.backgroundColor = "#bbb";
                }}
                onMouseLeave={e => {
                    (e.target as HTMLDivElement).style.backgroundColor = "#ddd";
                }}
            />

            {/* right panel */}
            <div
                style={{
                    flex: 1,
                    overflowY: "auto",
                    overflowX: "hidden",
                }}
            >
                {right}
            </div>
        </div>
    );
}