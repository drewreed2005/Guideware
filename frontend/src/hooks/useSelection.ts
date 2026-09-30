/* 
 * src/hooks/useSelection.ts
 * 
 * Defines the following, used for information handling and display when a Section/Task is
 * selected from the left panel:
 * - Selection type: descriminated union type which defines the selection as a Task, Section,
 *                   or Guide (when selecting the guide's header to view basic guide info)
 * - useSelection function: resolves and returns a selection's type and info using Selection union
 */

import { useState } from "react";
import type { Guide, Section, Task } from "../types/guide";


export type Selection =
    | { kind: "task"; item: Task }
    | { kind: "section"; item: Section }
    | { kind: "guide"; item: Guide }
    | null;


export function useSelection() {
    const [selection, setSelection] = useState<Selection>(null);

    const selectTask = (task: Task) =>
        setSelection({ kind: "task", item: task });

    const selectSection = (section: Section) =>
        setSelection({ kind: "section", item: section });

    const selectGuide = (guide: Guide) =>
        setSelection({ kind: "guide", item: guide });

    const clearSelection = () => setSelection(null);

    return { selection, selectTask, selectSection, selectGuide, clearSelection };
}