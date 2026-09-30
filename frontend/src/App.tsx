/*
 * src/App.tsx
 * 
 * Holds the main app build instructions
 */

import { useGuide } from "./hooks/useGuide";
import type { Section, Task } from "./types/guide";


function TaskItem({ task }: { task: Task }) {
    return (
        <div style={{ paddingLeft: "1rem" }}>
            <p>[] {task.name}</p>
            {task.instructions.value && (
                <p style={{ fontSize: "0.85rem", color: "#555" }}>
                    {task.instructions.value}
                </p>
            )}
        </div>
    );
}

function SectionItem({ section }: { section: Section }) {
    return (
        <div style={{ borderLeft: `4px solid ${section.color}`, paddingLeft: "0.75rem", marginBottom: "1rem" }}>
            <h3>{section.name}</h3>
            {section.children.map((child) =>
                child.type === "task" ? (
                    <TaskItem key={child.id} task={child} />
                ) : (
                    <SectionItem key={child.id} section={child} />
                )
            )}
        </div>
    );
}


function App() {
    const { guide, loading, error } = useGuide();

    if (loading) return <p>Loading guide...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!guide) return <p>No guide found.</p>;

    return (
        <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
            <h1>{guide.metadata.name}</h1>
            <p>{guide.metadata.description}</p>
            {guide.sections.map((section) => (
                <SectionItem key={section.id} section={section} />
            ))}
        </div>
    );
}

export default App;