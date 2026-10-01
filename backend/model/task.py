'''
task.py — TASK MODEL

---

Defines:
Task class: represents a task to be completed within a section of the guide
'''

import uuid
from datetime import timedelta
from typing import Literal

from pydantic import Field

from .common import InheritableContent


class Task(InheritableContent):
    type: Literal["task"] = "task"                  # type descriminator for faster parsing
    id: str = Field(default_factory = lambda: str(uuid.uuid4()))
    name: str
    description: str | None = None
    estimated_duration: timedelta | None = None     # duration is optional