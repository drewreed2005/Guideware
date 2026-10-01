/* 
 * src/components/detail/DetailPanel.tsx
 * 
 * Defines the right panel which outlines Task/Section/Guide details when they are selected
 * with a mix of shared sub-components and kind-specific item detail views
 */

import type { Selection } from "../../hooks/useSelection";
import type { Guide, Section, Task, Resource } from "../../types/guide";
import { formatDuration } from "../../utils/duration";


// shared sub-components

function DetailHeader({
    kind,
    name,
    color,
}: {
    kind: string;
    name: string;
    color?: string;
}) {
    // note: styling details here are temporary
    return (
        <div style={{ marginBottom: "1.5rem" }}>
            <p style={{
                margin: "0 0 4px",
                fontSize: "0.75rem",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                color: color ?? "#888",
                fontWeight: 600,
            }}>
                {kind}
            </p>
            <h2 style={{ margin: 0 }}>{name}</h2>
        </div>
    );
}


function DetailField({
    label,
    children,
}: {
    label: string;
    children: React.ReactNode;
}) {
    // note: styling details here are temporary
    return (
        <div style={{ marginBottom: "1.25rem" }}>
            <h4 style={{ margin: "0 0 6px", color: "#444", fontSize: "0.85rem" }}>
                {label}
            </h4>
            <div style={{ fontSize: "0.9rem", color: "#333", lineHeight: 1.6 }}>
                {children}
            </div>
        </div>
    );
}


function ResourceList({ resources }: { resources: Resource[] }) {
    if (resources.length === 0) return null;
    // note: styling details here are temporary
    return (
        <DetailField label="Resources">
            {resources.map((r, i) => (
                <div key={i} style={{ marginBottom: "8px" }}>
                    <strong>{r.label}</strong>
                    {r.url && (
                        <a
                            href={r.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ marginLeft: "8px", fontSize: "0.85rem" }}
                        >
                            {r.url}
                        </a>
                    )}
                    {r.contact && (
                        <span style={{
                            marginLeft: "8px",
                            fontSize: "0.85rem",
                            color: "#555"
                        }}>
                            {r.contact}
                        </span>
                    )}
                    {r.notes && (
                        <p style={{ margin: "2px 0 0", fontSize: "0.8rem", color: "#777" }}>
                            {r.notes}
                        </p>
                    )}
                </div>
            ))}
        </DetailField>
    );
}


// kind-specific detail views

function GuideDetail({ guide }: { guide: Guide }) {
    return (
        <>
            <DetailHeader kind="Guide" name={guide.metadata.name} />

            <DetailField label="Author">
                {guide.metadata.author}
            </DetailField>

            <DetailField label="Date">
                {guide.metadata.created_date}
            </DetailField>

            {guide.metadata.description && (
                <DetailField label="Description">
                    {guide.metadata.description}
                </DetailField>
            )}

            {guide.estimated_duration !== null && (
                <DetailField label="Estimated Duration">
                    {formatDuration(guide.estimated_duration)}
                </DetailField>
            )}

            <DetailField label="Structure">
                {guide.sections.length} section{guide.sections.length !== 1 ? "s" : ""}
            </DetailField>

            <ResourceList resources={guide.resources} />
        </>
    );
}


function SectionDetail({ section }: { section: Section }) {
    return (
        <>
            <DetailHeader
                kind="Section"
                name={section.name}
                color={section.color}
            />

            <DetailField label="Ordering">
                {section.ordering === "ordered" ? "Ordered" : "Unordered"}
            </DetailField>

            {section.estimated_duration !== null && (
                <DetailField label="Estimated Duration">
                    {formatDuration(section.estimated_duration)}
                </DetailField>
            )}

            {section.instructions.value && (
                <DetailField label="Instructions">
                    {section.instructions.value}
                </DetailField>
            )}

            <DetailField label="Children">
                {section.children.length} item{section.children.length !== 1 ? "s" : ""}
            </DetailField>

            <ResourceList resources={section.resources.value ?? []} />
        </>
    );
}


function TaskDetail({ task }: { task: Task }) {
    return (
        <>
            <DetailHeader kind="Task" name={task.name} />

            {task.description && (
                <DetailField label="Description">
                    {task.description}
                </DetailField>
            )}

            {task.estimated_duration !== null && (
                <DetailField label="Estimated Duration">
                    {formatDuration(task.estimated_duration)}
                </DetailField>
            )}

            {task.instructions.value && (
                <DetailField label="Instructions">
                    {task.instructions.value}
                </DetailField>
            )}

            <ResourceList resources={task.resources.value ?? []} />
        </>
    );
}


// root DetailPanel

interface DetailPanelProps {
    selection: Selection;
}


export function DetailPanel({ selection }: DetailPanelProps) {
    if (!selection) {
        // note: styling details here are temporary
        return (
            <div style={{
                padding: "2rem",
                color: "#999",
                fontSize: "0.9rem"
            }}>
                Select a task or section to view details.
            </div>
        );
    }

    // note: styling details here are temporary
    return (
        <div style={{ padding: "1.5rem", fontFamily: "sans-serif" }}>
            {selection.kind === "guide" && (
                <GuideDetail guide={selection.item} />
            )}
            {selection.kind === "section" && (
                <SectionDetail section={selection.item} />
            )}
            {selection.kind === "task" && (
                <TaskDetail task={selection.item} />
            )}
        </div>
    );
}