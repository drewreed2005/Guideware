/* 
 * src/hooks/useSelection.ts
 * 
 * Defines the following, used for information handling and display when a Section/Task is
 * selected from the left panel:
 * - Selection type: descriminated union type which defines the selection as a Task, Section,
 *                   or Guide (when selecting the guide's header to view basic guide info)
 * - useSelection function: resolves and returns a selection's type and info using Selection union
 */

import { useEffect, useState } from "react";
import type { Guide, Section, Task } from "../types/guide";


export type Selection =
    | { kind: "task"; item: Task }
    | { kind: "section"; item: Section }
    | { kind: "guide"; item: Guide }
    | null;


export function useSelection(guide?: Guide) {
    const [selection, setSelection] = useState<Selection>(null);

    // displaying the guide info automatically when the guide loads
    useEffect(() => {
        if (guide) {
            setSelection({ kind: "guide", item: guide });
        }
    }, [guide]);

    const selectTask = (task: Task) =>
        setSelection(prev =>
            prev?.kind === "task" && prev.item.id === task.id ? null : { kind: "task", item: task }
        );

    const selectSection = (section: Section) =>
        setSelection(prev =>
            prev?.kind === "section" && prev.item.id === section.id ? null : { kind: "section", item: section }
        );

    const selectGuide = (guide: Guide) =>
        setSelection(prev =>
            prev?.kind === "guide" ? null : { kind: "guide", item: guide }
        );

    const clearSelection = () => setSelection(null);

    return { selection, selectTask, selectSection, selectGuide, clearSelection };
}