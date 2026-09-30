'''
test_parser.py — .gware FILE PARSER UNIT TEST SUITE

---

Contains the following indicatively-named tests:
* test_load_guide_from_json_returns_guide
* test_demo_guide_metadata
* test_demo_guide_section_count
* test_demo_guide_task_count
* test_t1_inherits_instructions_from_section
* test_t2_overrides_instructions
* test_t2_inherits_image_from_t1_in_ordered_section
* test_unordered_tasks_inherit_from_section_not_sibling
* test_save_creates_gware_file
* test_gware_contains_plan_json
* test_round_trip_preserves_metadata
* test_round_trip_preserves_section_structure
* test_round_trip_preserves_resolved_instructions
'''

import zipfile
from datetime import date
from pathlib import Path

from backend.model import Guide
from backend.parser import (
    load_guide,
    load_guide_from_json,
    save_guide,
)

DEMO_JSON = Path("demo/sample_guide.json")
DEMO_GWARE = Path("demo/sample_guide.gware")


# basic parsing

def test_load_guide_from_json_returns_guide():
    guide = load_guide_from_json(DEMO_JSON)
    assert isinstance(guide, Guide)


def test_demo_guide_metadata():
    guide = load_guide_from_json(DEMO_JSON)
    assert guide.metadata.name == "Onboarding Guide"
    assert guide.metadata.author == "Dontell"
    assert guide.metadata.created_date == date(2026, 9, 1)


def test_demo_guide_section_count():
    guide = load_guide_from_json(DEMO_JSON)
    assert len(guide.sections) == 2


def test_demo_guide_task_count():
    guide = load_guide_from_json(DEMO_JSON)
    total_tasks = sum(len(s.children) for s in guide.sections)
    assert total_tasks == 4


# inheritance on real data

def test_t1_inherits_instructions_from_section():
    # t1 has inherit = True and no value; should receive s1's instructions 
    guide = load_guide_from_json(DEMO_JSON)
    t1 = guide.sections[0].children[0]
    assert t1.instructions.value == "Please read all materials before proceeding."


def test_t2_overrides_instructions():
    # t2 defines its own instructions; should not inherit from s1.
    guide = load_guide_from_json(DEMO_JSON)
    t2 = guide.sections[0].children[1]
    assert t2.instructions.value == "Pay close attention."


def test_t2_inherits_image_from_t1_in_ordered_section():
    # s1 is ordered. t2 follows t1, which has no image
    # t2 should also resolve to no image
    guide = load_guide_from_json(DEMO_JSON)
    t2 = guide.sections[0].children[1]
    assert t2.image_path.value is None


def test_unordered_tasks_inherit_from_section_not_sibling():
    # s2 is unordered. t3 and t4 should both inherit from s2 directly, not from each other
    guide = load_guide_from_json(DEMO_JSON)
    t3 = guide.sections[1].children[0]
    t4 = guide.sections[1].children[1]
    assert t3.instructions.value == "Complete all setup tasks in any order."
    assert t4.instructions.value == "Complete all setup tasks in any order."


# .gware round-trip

def test_save_creates_gware_file(tmp_path):
    # save_guide should create a zip archive at the given path
    guide = load_guide_from_json(DEMO_JSON)
    output = tmp_path / "test_output.gware"
    save_guide(guide, output)
    assert output.exists()
    assert zipfile.is_zipfile(output)


def test_gware_contains_plan_json(tmp_path):
    # the .gware archive should contain a plan.json entry
    guide = load_guide_from_json(DEMO_JSON)
    output = tmp_path / "test_output.gware"
    save_guide(guide, output)
    with zipfile.ZipFile(output, "r") as zf:
        assert "plan.json" in zf.namelist()


def test_round_trip_preserves_metadata(tmp_path):
    # a guide saved to .gware and reloaded should have identical metadata to the original
    original = load_guide_from_json(DEMO_JSON)
    output = tmp_path / "round_trip.gware"
    save_guide(original, output)
    reloaded = load_guide(output)
    assert reloaded.metadata.name == original.metadata.name
    assert reloaded.metadata.author == original.metadata.author
    assert reloaded.metadata.created_date == original.metadata.created_date


def test_round_trip_preserves_section_structure(tmp_path):
    # section and task counts should survive a save/load cycle
    original = load_guide_from_json(DEMO_JSON)
    output = tmp_path / "round_trip.gware"
    save_guide(original, output)
    reloaded = load_guide(output)
    assert len(reloaded.sections) == len(original.sections)
    for original_section, reloaded_section in zip(
        original.sections, reloaded.sections
    ):
        assert len(reloaded_section.children) == len(original_section.children)


def test_round_trip_preserves_resolved_instructions(tmp_path):
    # resolved inheritance values should be preserved through a save/load cycle,
    # since save_guide writes the already-resolved guide.
    original = load_guide_from_json(DEMO_JSON)
    output = tmp_path / "round_trip.gware"
    save_guide(original, output)
    reloaded = load_guide(output)
    original_t1 = original.sections[0].children[0]
    reloaded_t1 = reloaded.sections[0].children[0]
    assert reloaded_t1.instructions.value == original_t1.instructions.value