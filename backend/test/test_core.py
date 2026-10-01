'''
test_core.py — MODEL DETAIL INHERITANCE TEST SUITE

---

Contains test helper(s):
* _make_guide

Contains the following indicatively-named tests:
* test_task_inherits_from_section
* test_task_overrides_section
* test_task_explicitly_declines_inheritance
* test_ordered_task_inherits_from_prior_sibling
* test_unordered_task_does_not_inherit_from_sibling
'''

from datetime import date

from backend.core import resolve_guide
from backend.model import (
    Guide,
    GuideMetadata,
    InheritableField,
    OrderingType,
    Section,
    Task,
)


def _make_guide(sections):
    return Guide(
        metadata=GuideMetadata(
            name="Test", author="Dontell", created_date=date(2026, 1, 1)
        ),
        sections=sections,
    )


def test_task_inherits_from_section():
    guide = _make_guide([
        Section(
            id="s1", name="Setup",
            instructions=InheritableField(value="Read carefully.", inherit=False),
            color=InheritableField(value="#000000", inherit=False),
            children=[
                Task(id="t1", name="First Task", type="task")
            ]
        )
    ])
    resolved = resolve_guide(guide)
    task = resolved.sections[0].children[0]
    assert task.instructions.value == "Read carefully."


def test_task_overrides_section():
    guide = _make_guide([
        Section(
            id="s1", name="Setup",
            instructions=InheritableField(value="Section instruction.", inherit=False),
            color=InheritableField(value="#000000", inherit=False),
            children=[
                Task(
                    id="t1", name="Override Task", type="task",
                    instructions=InheritableField(value="Task instruction.", inherit=False)
                )
            ]
        )
    ])
    resolved = resolve_guide(guide)
    task = resolved.sections[0].children[0]
    assert task.instructions.value == "Task instruction."


def test_task_explicitly_declines_inheritance():
    guide = _make_guide([
        Section(
            id="s1", name="Setup",
            instructions=InheritableField(value="Section instruction.", inherit=False),
            color=InheritableField(value="#000000", inherit=False),
            children=[
                Task(
                    id="t1", name="No Inherit Task", type="task",
                    instructions=InheritableField(value=None, inherit=False)
                )
            ]
        )
    ])
    resolved = resolve_guide(guide)
    task = resolved.sections[0].children[0]
    assert task.instructions.value is None


def test_ordered_task_inherits_from_prior_sibling():
    guide = _make_guide([
        Section(
            id="s1", name="Setup",
            ordering=OrderingType.ordered,
            color=InheritableField(value="#000000", inherit=False),
            children=[
                Task(
                    id="t1", name="First", type="task",
                    image_path=InheritableField(value="images/ref.png", inherit=False)
                ),
                Task(id="t2", name="Second", type="task"),
            ]
        )
    ])
    resolved = resolve_guide(guide)
    second_task = resolved.sections[0].children[1]
    assert second_task.image_path.value == "images/ref.png"


def test_unordered_task_does_not_inherit_from_sibling():
    guide = _make_guide([
        Section(
            id="s1", name="Setup",
            ordering=OrderingType.unordered,
            color=InheritableField(value="#000000", inherit=False),
            children=[
                Task(
                    id="t1", name="First", type="task",
                    image_path=InheritableField(value="images/ref.png", inherit=False)
                ),
                Task(id="t2", name="Second", type="task"),
            ]
        )
    ])
    resolved = resolve_guide(guide)
    second_task = resolved.sections[0].children[1]
    assert second_task.image_path.value is None