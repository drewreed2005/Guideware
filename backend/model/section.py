'''
section.py — SECTION MODEL WITH NESTING BEHAVIOR

---

Defines:
OrderingType enum: defines if a section/subsection's tasks have a particular order
    (During runtime, a task in an ordered section completed before something previous skips that previous step)
Section class: represents a section containing tasks and/or sections within the guide
'''


from __future__ import annotations

from datetime import timedelta
from enum import Enum
from typing import Annotated, Literal

from pydantic import Field

from .common import InheritableContent
from .task import Task


class OrderingType(str, Enum):
    ordered = "ordered"
    unordered = "unordered"


class Section(InheritableContent):
    type: Literal["section"] = "section"            # type discriminator for faster parsing
    name: str
    color: str                                      # hexadecimal; defined explicitly for sections
    ordering: OrderingType = OrderingType.ordered
    estimated_duration: timedelta | None = None     # expected time to complete all tasks/subsections within
    children: list[Annotated[Section | Task, Field(discriminator = "type")]] = Field(default_factory = list)


# resolving self-referential type for Pydantic
Section.model_rebuild()