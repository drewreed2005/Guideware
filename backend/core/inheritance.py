'''
inheritance.py — INHERITANCE RESOLUTION BEHAVIOR

---

Defines:
resolve_guide function: returns a deep copy of a guide with resolved inheritance
'''

from backend.model import Guide


def resolve_guide(guide: Guide) -> Guide:
    '''
    Returns a deep copy of the guide with all inheritable fields resolved downward
    through the section/task tree.
    '''