'''
common.py — COMMON CLASSES/INFO FOR MULTIPLE MODEL CLASSES

---

Consists of:
Resource class (representing external resources linked to the guide)
InheritableField class (a wrapper for an inherited field that handles explicit no-inheritance logic)
InheritableContent class (a base class for any inheritable content between sections)
'''

from typing import Generic, TypeVar

from pydantic import BaseModel, Field

from .annotation import Annotation


class Resource(BaseModel):
    label: str
    url: str | None = None
    contact: str | None = None
    notes: str | None = None


T = TypeVar("T")
class InheritableField(BaseModel, Generic[T]):
    value: T | None = None
    inherit: bool = True


class InheritableContent(BaseModel):
    instructions: InheritableField[str] = Field(
        default_factory = lambda: InheritableField[str]()
    )
    image_path: InheritableField[str] = Field(
        default_factory = lambda: InheritableField[str]()
    )
    annotations: InheritableField[list[Annotation]] = Field(
        default_factory = lambda: InheritableField[list[Annotation]]()
    )
    resources: InheritableField[list[Resource]] = Field(
        default_factory = lambda: InheritableField[list[Resource]]()
    )
    color: InheritableField[str] = Field(
        default_factory=lambda: InheritableField[str]()
    )

# notes on overwriting/inheritance:
# - it is intentional that the user be able to inherit one attribute and not the other
#   such that it is possible to create new annotations over the same inherited image
# - tasks in ordered sections inherit from the prior task in the section, while they
#   inherit from the section itself if its immediate wrapper section is unordered