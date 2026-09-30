'''
guide.py — GUIDE DOCUMENT MODEL

---

Defines:
GuideMetadata class: represents details about the creation/author of the guide
Guide class: represents a full guide containing sections, as well as its metadata, resources, sections, etc.
'''

from datetime import date, timedelta

from pydantic import BaseModel, Field

from .common import Resource
from .section import Section


class GuideMetadata(BaseModel):
    name: str
    author: str
    created_date: date
    description: str | None = None
    version: str = "1.0"


class Guide(BaseModel):
    metadata: GuideMetadata
    resources: list[Resource] = Field(default_factory = list)
    image_path: str | None = None
    estimated_duration: timedelta | None = None
    sections: list[Section] = Field(default_factory = list)