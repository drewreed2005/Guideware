/*
 * src/types/guide.ts
 * 
 * Defines the following types for use in data handling:
 * - InheritableField
 * - Resource
 * - Annotation
 * - Task
 * - Section
 * - GuideMetadata
 * - Guide
 */


export interface InheritableField<T> {
    value: T | null;
    inherit: boolean;
}

export interface Resource {
    label: string;
    url: string | null;
    contact: string | null;
    notes: string | null;
}

export interface Annotation {
    shape_type: string;
    color: { r: number; g: number; b: number; a: number };
    points: { x: number; y: number }[];
    label: string | null;
    stroke_width: number;
    fill: boolean;
}

export interface Task {
    type: "task";
    id: string;
    name: string;
    description: string | null;
    estimated_duration: number | null;
    color_override: string | null;
    instructions: InheritableField<string>;
    image_path: InheritableField<string>;
    annotations: InheritableField<Annotation[]>;
    resources: InheritableField<Resource[]>;
}

export interface Section {
    type: "section";
    id: string;
    name: string;
    color: string;
    ordering: "ordered" | "unordered";
    estimated_duration: number | null;
    instructions: InheritableField<string>;
    image_path: InheritableField<string>;
    annotations: InheritableField<Annotation[]>;
    resources: InheritableField<Resource[]>;
    children: (Section | Task)[];
}

export interface GuideMetadata {
    name: string;
    author: string;
    created_date: string;
    description: string | null;
    version: string | null;
}

export interface Guide {
    id: null;
    metadata: GuideMetadata;
    resources: Resource[];
    image_path: string | null;
    estimated_duration: number | null;
    sections: Section[];
}