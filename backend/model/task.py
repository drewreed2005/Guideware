'''
task.py — TASK MODEL

---

Defines:
Task class: represents a task to be completed within a section of the guide
'''

from datetime import timedelta
from typing import Literal

from common import InheritableContent


class Task(InheritableContent):
    name: str
    description: str | None = None
    estimated_duration: timedelta | None = None     # duration is optional
    color_override: str | None = None               # hexadecimal value override; if None, derived
    type: Literal["task"] = "task"                  # type descriminator for faster parsing