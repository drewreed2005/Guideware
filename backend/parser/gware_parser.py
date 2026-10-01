'''
gware_parser.py — .gware file read/write logic

---

Defines the following:
load_guide_from_json function: loads and resolves a Guide from a plain JSON file
load_guide function: loads and resolves a Guide from a .gware zip archive
save_guide function: saves a Guide to a .gware zip archive
'''

import json
import zipfile
from pathlib import Path

from backend.model import Guide, UnresolvedGuide

# constants for JSON/zip file reading
READ_MODE = 'r'
WRITE_MODE = 'w'
JSON_ENCODING = "utf-8"
JSON_INDENT = 2
ZIP_JSON_FILENAME = "plan.json"


def load_guide_from_json(path: Path) -> UnresolvedGuide:
    with open(path, READ_MODE, encoding = JSON_ENCODING) as f:
        raw = json.load(f)
    return UnresolvedGuide(Guide.model_validate(raw))


def load_guide(path: Path) -> UnresolvedGuide:
    # could check if `path.suffix == ".gware`
    # but that can be saved for when exception handling is supported for this
    with zipfile.ZipFile(path, READ_MODE) as zf, zf.open(ZIP_JSON_FILENAME) as f:
        raw = json.load(f)
    return UnresolvedGuide(Guide.model_validate(raw))


def save_guide(guide: UnresolvedGuide, path: Path) -> None:
    with zipfile.ZipFile(path, WRITE_MODE, zipfile.ZIP_DEFLATED) as zf:
        zf.writestr(ZIP_JSON_FILENAME, guide.model_dump_json(indent = JSON_INDENT))