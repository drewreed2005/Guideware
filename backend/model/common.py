'''
common.py — COMMON CLASSES/INFO FOR MULTIPLE MODEL CLASSES

---

Consists of:
Resource class (representing external resources linked to the guide)
InheritableContent class (a base class for any inheritable content between sections)
'''

from annotation import Annotation
from pydantic import BaseModel, Field


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

# note on overwriting/inheritance of images/annotations:
# it is intentional that the user be able to inherit one and not the other
# such that it is possible to create new annotations over the same inherited image