'''
annotation.py — ANNOTATION MODEL FOR ASSOCIATED IMAGES

Contains classes descriptive of basic annotations that can be made over images
uploaded and associated with sections/tasks in a guide document.

Note that changes to the annotation system's design may change over time, so
modularity between versions may be important.

---

Consists of:

ShapeType enum (determines what kind of annotation)
Color class (pydantic-compatible RGBA color class for annotations)
Point class (pydantic-compatible x-y coordinate point representation for annotations)
Annotation class, including:
- shape_type (see ShapeType enum)
- color (see Color)
- points (a list of Point objects representing shape details; see Point)
- label (optional string object label)
- stroke_width (float representation of line width for shapes, currently arbitrary)
- fill (boolean, indicating whether or not the shape should have its interior area filled)

'''

from pydantic import BaseModel, Field
from enum import Enum


class ShapeType(str, Enum):
    rectangle = "rectangle"
    ellipse = "ellipse"
    line = "line"
    arrow = "arrow"
    text = "text"
    freehand = "freehand"

class Color(BaseModel):
    r: int = Field(ge=0, le=255)
    g: int = Field(ge=0, le=255)
    b: int = Field(ge=0, le=255)
    a: float = Field(default=1.0, ge=0.0, le=1.0)

class Point(BaseModel):
    # relative coordinates (0.0 to 1.0 as proportion of image dimensions)
    x: float = Field(ge=0.0, le=1.0)
    y: float = Field(ge=0.0, le=1.0)


class Annotation(BaseModel):
    shape_type: ShapeType
    color: Color
    points: list[Point]         # meaning dependent on shape_type
    label: str | None = None    # optional shape label
    stroke_width: float = 2.0
    fill: bool = False