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
import { GuideItem } from "./GuideItem";


interface GuideTreeProps {
    guide: Guide;
    selectedId: string | null;
    selectedKind: string | null;
    onSelectTask: (task: Task) => void;
    onSelectSection: (section: Section) => void;
    onSelectGuide: (guide: Guide) => void;
}

export function GuideTree({
    guide,
    selectedId,
    selectedKind,
    onSelectTask,
    onSelectSection,
    onSelectGuide
}: GuideTreeProps) {
    // note: styling details here are temporary
    return (
        <div style={{ padding: "12px" }}>
            <GuideItem
                guide={guide}
                isSelected={selectedKind === "guide"}
                onSelect={onSelectGuide}
            />
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