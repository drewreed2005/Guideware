'''
common.py — COMMON CLASSES/INFO FOR MULTIPLE MODEL CLASSES

---

Consists of:
Resource class (representing external resources linked to the guide)

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