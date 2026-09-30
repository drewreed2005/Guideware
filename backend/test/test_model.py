'''
test_model.py — MODEL UNIT TEST SUITE

---

Contains the following indicatively-named tests:
* test_guide_parses_from_dict
* test_task_gets_default_id
* test_two_tasks_get_different_ids
* test_duplicate_ids_raise_validation_error
'''


import pytest
from pydantic import ValidationError

from backend.model import Guide, Task


def test_guide_parses_from_dict():
    # raw dictionary data for test
    raw = {
        "metadata": {
            "name": "Test Guide",
            "author": "Dontell Aniwone",
            "created_date": "2026-01-01"
        },
        "sections": [
            {
                "type": "section",
                "name": "Section 1",
                "color": "#4A90D9",
                "children": [
                    {
                        "type": "task",
                        "name": "Task 1"
                    }
                ]
            }
        ]
    }
    
    guide = Guide.model_validate(raw)
    assert guide.metadata.name == "Test Guide"
    assert len(guide.sections) == 1


# id tests

def test_task_gets_default_id():
    task = Task(name="Test Task", type="task")
    assert task.id is not None
    assert len(task.id) > 0


def test_two_tasks_get_different_ids():
    t1 = Task(name="Task One", type="task")
    t2 = Task(name="Task Two", type="task")
    assert t1.id != t2.id


def test_duplicate_ids_raise_validation_error():
    with pytest.raises(ValidationError):
        Guide.model_validate({
            "metadata": {
                "name": "Test",
                "author": "Dontell",
                "created_date": "2026-01-01"
            },
            "sections": [
                {
                    "type": "section",
                    "id": "s1",
                    "name": "Section One",
                    "color": "#000000",
                    "children": [
                        {"type": "task", "id": "dupe", "name": "Task A"},
                        {"type": "task", "id": "dupe", "name": "Task B"},
                    ]
                }
            ]
        })