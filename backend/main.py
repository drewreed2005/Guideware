'''
main.py — FASTAPI ENTRY POINT

---

Handles FastAPI logic via the following:
get_demo_guide function: "GET" from "/demo_guide", returns the resolved demo guide

'''

import os
from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from backend.core import resolve_guide
from backend.parser import load_guide_from_json

LOCALHOST_ADDRESS = "http://localhost:5173"
DEMO_GUIDE_PATH = Path("backend/demo/sample_guide.json")

allowed_origins = [
    LOCALHOST_ADDRESS,
    os.environ.get("FRONTEND_URL", ""),
]


app = FastAPI(
    title = "Guideware API",
    description = "Backend API for the Guideware instructions document/tracker application",
    version="0.1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins = [o for o in allowed_origins if o],
    allow_methods = ["GET", "POST"],
    allow_headers = ["*"]
)


@app.get("/demo_guide")
def get_demo_guide():
    if not DEMO_GUIDE_PATH.exists():
        raise HTTPException(
            status_code = 404,
            detail = f"Demo guide not found at {DEMO_GUIDE_PATH}"
        )
    guide = load_guide_from_json(DEMO_GUIDE_PATH)
    return resolve_guide(guide).model_dump()


@app.get("/health")
def health_check():
    return {"status": "ok"}