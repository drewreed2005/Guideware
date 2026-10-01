/* 
 * src/components/guide/GuideItem.tsx
 * 
 * Defines the layout/structure of a Guide item when selected within the Guideware
 * guide view (via the main header) using the following:
 * - GuideItemProps interface: defines guide attributes for use in functions below
 * - GuideItem function: defines the structure and click behaviors of guide display
 */

import type { Guide } from "../../types/guide";
import { formatDuration } from "../../utils/duration";


interface GuideItemProps {
    guide: Guide;
    isSelected: boolean;
    onSelect: (guide: Guide) => void;
}


export function GuideItem({ guide, isSelected, onSelect }: GuideItemProps) {
    // note: styling details here are temporary
    return (
        <div
            onClick={() => onSelect(guide)}
            style={{
                padding: "10px 12px",
                marginBottom: "16px",
                borderRadius: "6px",
                cursor: "pointer",
                backgroundColor: isSelected ? "#e8f0fb" : "#f0f0f0",
                outline: isSelected ? "2px solid #4A90D9" : "none",
                outlineOffset: "-2px",
                userSelect: "none",
            }}
        >
            <h2 style={{ margin: "0 0 2px", fontSize: "1.1rem" }}>
                {guide.metadata.name}
            </h2>
            <p style={{ margin: 0, fontSize: "0.78rem", color: "#666" }}>
                {guide.metadata.author} · {guide.metadata.created_date}
            </p>
            {guide.estimated_duration !== null && (
                <p style={{ margin: "4px 0 0", fontSize: "0.78rem", color: "#888" }}>
                    ~{formatDuration(guide.estimated_duration)} total
                </p>
            )}
        </div>
    );
}