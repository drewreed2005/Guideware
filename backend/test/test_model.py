'''
test_model.py — MODEL UNIT TEST SUITE

---

Contains the following indicatively-named tests:
* test_guide_parses_from_dict
'''


from backend.model import Guide


def test_guide_parses_from_dict():
    # raw dictionary data for test
    raw = {
        "metadata": {
            "name": "Test Guide",
            "author": "Dontell Aniwone",
            "created_date": "2026-01-01"
        },
        "sections": [
            {
                "type": "section",
                "name": "Section 1",
                "color": "#4A90D9",
                "children": [
                    {
                        "type": "task",
                        "name": "Task 1"
                    }
                ]
            }
        ]
    }
    
    guide = Guide.model_validate(raw)
    assert guide.metadata.name == "Test Guide"
    assert len(guide.sections) == 1