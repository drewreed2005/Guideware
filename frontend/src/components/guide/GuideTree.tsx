/* 
 * src/components/guide/GuideTree.tsx
 * 
 * Defines the structure of the Guideware guide tree in the left panel, which displays
 * tasks and subsections within larger sections, using the following:
 * - GuideTreeProps interface: represents attributes of the guide tree structure for the following
 * - GuideTree function: sets up the tree structure for the guide display with its behaviors
 */

import type { Guide, Section, Task } from "../../types/guide";
import { SectionItem } from "./SectionItem";


interface GuideTreeProps {
    guide: Guide;
    selectedId: string | null;
    onSelectTask: (task: Task) => void;
    onSelectSection: (section: Section) => void;
}

export function GuideTree({
    guide,
    selectedId,
    onSelectTask,
    onSelectSection,
}: GuideTreeProps) {
    // note: styling details here are temporary
    return (
        <div style={{ padding: "12px" }}>
            <div style={{ marginBottom: "16px" }}>
                <h2 style={{ margin: 0, fontSize: "1.1rem" }}>
                    {guide.metadata.name}
                </h2>
                <p style={{
                    margin: "4px 0 0",
                    fontSize: "0.8rem",
                    color: "#666"
                }}>
                    {guide.metadata.author} · {guide.metadata.created_date}
                </p>
            </div>
            {guide.sections.map(section => (
                <SectionItem
                    key={section.id}
                    section={section}
                    selectedId={selectedId}
                    isSelected={selectedId === section.id}
                    onSelectTask={onSelectTask}
                    onSelectSection={onSelectSection}
                />
            ))}
        </div>
    );
}