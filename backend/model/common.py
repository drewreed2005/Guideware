'''
common.py — COMMON CLASSES/INFO FOR MULTIPLE MODEL CLASSES

---

Consists of:
Resource class (representing external resources linked to the guide)
InheritableContent class (a base class for any inheritable content between sections)
'''

from pydantic import BaseModel, Field

from .annotation import Annotation


class Resource(BaseModel):
    label: str
    url: str | None = None
    contact: str | None = None
    notes: str | None = None


class InheritableContent(BaseModel):
    instructions: str | None = None
    resources: list[Resource] = Field(default_factory = list)
    image_path: str | None = None
    annotations: list[Annotation] = Field(default_factory = list)

# notes on overwriting/inheritance:
# - it is intentional that the user be able to inherit one attribute and not the other
#   such that it is possible to create new annotations over the same inherited image
# - tasks in ordered sections inherit from the prior task in the section, while they
#   inherit from the section itself if its immediate wrapper section is unordered