/* 
 * src/components/guide/SectionItem.tsx
 * 
 * Defines the layout/structure of a Section item when selected within the Guideware
 * guide view using the following:
 * - SectionItemProps interface: defines section attributes for use in functions below
 * - countTasks function: calculates the total number of tasks associated with a particular section
 * - SectionItem function: defines the structure and click behaviors of section display
 */

import { useState } from "react";
import type { Section, Task } from "../../types/guide";
import { sectionBorderColor, lightenColor } from "../../utils/color";
import { formatDuration } from "../../utils/duration";
import { TaskItem } from "./TaskItem";


interface SectionItemProps {
    section: Section;
    depth?: number;
    isSelected: boolean;
    selectedId: string | null;
    onSelectTask: (task: Task) => void;
    onSelectSection: (section: Section) => void;
}


function countTasks(section: Section): number {
    return section.children.reduce((count, child) => {
        if (child.type === "task") return count + 1;
        return count + countTasks(child);
    }, 0);
}


export function SectionItem({
    section,
    depth = 0,
    isSelected,
    selectedId,
    onSelectTask,
    onSelectSection,
}: SectionItemProps) {
    const [collapsed, setCollapsed] = useState(false);

    const borderColor = sectionBorderColor(section.color, depth);
    const taskCount = countTasks(section);
    const indentPx = depth * 12;

    // note: styling details here are temporary
    return (
        <div
            style={{
                marginLeft: `${indentPx}px`,
                marginBottom: "8px",
                borderLeft: `3px solid ${borderColor}`,
                borderRadius: "4px",
            }}
        >
            {/* section header */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "6px 10px",
                    backgroundColor: lightenColor(section.color, 0.92),
                    borderRadius: "4px 4px 0 0",
                    cursor: "pointer",
                    userSelect: "none",
                    outline: isSelected
                        ? `2px solid ${section.color}`
                        : "none",
                    outlineOffset: "-2px",
                }}
                onClick={() => onSelectSection(section)}
            >
                {/* left side: collapse toggle + name */}
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span
                        onClick={e => {
                            e.stopPropagation();
                            setCollapsed(c => !c);
                        }}
                        style={{
                            fontSize: "0.7rem",
                            color: "#666",
                            padding: "2px 4px",
                            borderRadius: "3px",
                            lineHeight: 1,
                        }}
                    >
                        {collapsed ? "▶" : "▼"}
                    </span>
                    <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>
                        {section.name}
                    </span>
                </div>

                {/* right side: task count + duration */}
                <div
                    style={{
                        display: "flex",
                        gap: "8px",
                        alignItems: "center",
                        fontSize: "0.75rem",
                        color: "#555",
                    }}
                >
                    <span>{taskCount} task{taskCount !== 1 ? "s" : ""}</span>
                    {section.estimated_duration !== null && (
                        <span>~{formatDuration(section.estimated_duration)}</span>
                    )}
                </div>
            </div>

            {/* children */}
            {!collapsed && (
                <div style={{ padding: "6px 8px" }}>
                    {section.children.map(child =>
                        child.type === "task" ? (
                            <TaskItem
                                key={child.id}
                                task={child}
                                sectionColor={section.color}
                                isSelected={selectedId === child.id}
                                onSelect={onSelectTask}
                            />
                        ) : (
                            <SectionItem
                                key={child.id}
                                section={child}
                                depth={depth + 1}
                                isSelected={selectedId === child.id}
                                selectedId={selectedId}
                                onSelectTask={onSelectTask}
                                onSelectSection={onSelectSection}
                            />
                        )
                    )}
                </div>
            )}
        </div>
    );
}