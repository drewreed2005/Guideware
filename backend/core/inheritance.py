'''
inheritance.py — INHERITANCE RESOLUTION BEHAVIOR

---

Defines:
InheritanceContext class: data class that carries resolved inheritable values during tree traversal
resolve_guide function: returns a deep copy of a guide with resolved inheritance
Private helpers for resolve_guide behavior
'''

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any

from backend.model import (
    Annotation,
    Guide,
    InheritableContent,
    InheritableField,
    OrderingType,
    Resource,
    Section,
    Task,
)


@dataclass
class InheritanceContext:
    '''
    Carries the current resolved inheritable values as the inheritance tree is traversed.
    Each field holds the nearest ancestor's resolved value, or None if no ancestor has defined one.
    '''
    instructions: str | None = None
    image_path: str | None = None
    annotations: list[Annotation] = field(default_factory = list)
    resources: list[Resource] = field(default_factory = list)


def _resolve_field(inheritable: InheritableField, context_value: Any) -> Any:
    # if the inheritable has no value, use prior context value
    if inheritable.inherit and inheritable.value is None:
        return context_value
    
    # otherwise, an overwriting value exists, so it should be prioritized
    return inheritable.value


def _resolve_content(
    content: InheritableContent, context: InheritanceContext
) -> tuple[InheritableContent, InheritanceContext]:
    # resolving all inheritable fields
    resolved_instructions = _resolve_field(content.instructions, context.instructions)
    resolved_image_path = _resolve_field(content.image_path, context.image_path)
    resolved_annotations = _resolve_field(content.annotations, context.annotations)
    resolved_resources = _resolve_field(content.resources, context.resources)
    
    # building resolved content with concrete values
    resolved_content = content.model_copy(update = {
        "instructions": InheritableField(value = resolved_instructions, inherit = False),
        "image_path": InheritableField(value = resolved_image_path, inherit = False),
        "annotations": InheritableField(value = resolved_annotations or [], inherit = False),
        "resources": InheritableField(value = resolved_resources or [], inherit = False)
    })
    
    # building updated context for children
    child_context = InheritanceContext(
        instructions = resolved_instructions,
        image_path = resolved_image_path,
        annotations = resolved_annotations or [],
        resources = resolved_resources or []
    )

    return resolved_content, child_context


def _resolve_task(task: Task, context: InheritanceContext) -> Task:
    resolved_content, _ = _resolve_content(task, context)
    # tasks have no children, so the updated context is discarded
    return task.model_copy(update = {
        "instructions": resolved_content.instructions,
        "image_path": resolved_content.image_path,
        "annotations": resolved_content.annotations,
        "resources": resolved_content.resources
    })


def _resolve_section(section: Section, context: InheritanceContext) -> Section:
    resolved_content, child_context = _resolve_content(section, context)
    
    resolved_children = []
    
    # inheritance semantics with ordered vs. unordered sections require this
    # rolling child context, which updates as children update for ordered sections
    # (prior defined child_context is only initial for ordered sections)
    
    for child in section.children:
        if child.type == "task":
            resolved_task = _resolve_task(child, child_context)
            resolved_children.append(resolved_task)
            if section.ordering == OrderingType.ordered:
                # updating rolling context
                child_context = InheritanceContext(
                    instructions = resolved_task.instructions.value,
                    image_path = resolved_task.image_path.value,
                    annotations = resolved_task.annotations.value or [],
                    resources = resolved_task.resources.value or []
                )
        
        elif child.type == "section":
            resolved_child_section = _resolve_section(child, child_context)
            resolved_children.append(resolved_child_section)
            if section.ordering == OrderingType.ordered:
                # subsections also advance the rolling context
                child_context = InheritanceContext(
                    instructions = resolved_child_section.instructions.value,
                    image_path = resolved_child_section.image_path.value,
                    annotations = resolved_child_section.annotations.value or [],
                    resources = resolved_child_section.resources.value or [],
                )
    
    # returning a fully resolved section
    return section.model_copy(update = {
        "instructions": resolved_content.instructions,
        "image_path": resolved_content.image_path,
        "annotations": resolved_content.annotations,
        "resources": resolved_content.resources,
        "children": resolved_children,
    })


def resolve_guide(guide: Guide) -> Guide:
    '''
    Returns a deep copy of the guide with all inheritable fields resolved downward
    through the section/task tree.
    '''
    root_context = InheritanceContext()
    resolved_sections = [
        _resolve_section(section, root_context)
        for section in guide.sections
    ]
    return guide.model_copy(update = {"sections": resolved_sections})