/* 
 * src/components/guide/TaskItem.tsx
 * 
 * Defines the structure and behaviors of a Task item when selected within
 * the Guideware guide view using the following:
 * - TaskItemProps interface: defines task attributes for use in functions below
 * - TaskItem function: defines structure and click behaviors for task display
 */

import type { Task } from "../../types/guide";
import { lightenColor } from "../../utils/color";
import { formatDuration } from "../../utils/duration";

interface TaskItemProps {
    task: Task;
    sectionColor: string;
    isSelected: boolean;
    onSelect: (task: Task) => void;
}

export function TaskItem({
    task,
    sectionColor,
    isSelected,
    onSelect,
}: TaskItemProps) {
    const bgColor = task.color.value
        ? lightenColor(task.color.value, 0.85)
        : lightenColor(sectionColor, 0.85);

    const selectedStyle = isSelected
        ? {
            outline: `2px solid ${sectionColor}`,
            outlineOffset: "-2px",
        }
        : {};
    
    // note: styling details here are temporary
    return (
        <div
            onClick={() => onSelect(task)}
            style={{
                backgroundColor: bgColor,
                borderRadius: "6px",
                padding: "8px 12px",
                marginBottom: "6px",
                cursor: "pointer",
                ...selectedStyle,
            }}
        >
            <span style={{ fontSize: "0.9rem", fontWeight: 500 }}>
                {task.name}
            </span>
            {task.estimated_duration !== null && (
                <span
                    style={{
                        fontSize: "0.75rem",
                        color: "#666",
                        marginLeft: "8px",
                    }}
                >
                    ~{formatDuration(task.estimated_duration)}
                </span>
            )}
        </div>
    );
}