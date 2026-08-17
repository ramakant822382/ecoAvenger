from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.auth import router as auth_router
from fastapi import UploadFile, File

import io



# =========================================================
# FASTAPI APP
# =========================================================

app = FastAPI(
    title="EcoAvenger API",
    description="EcoAvenger Authentication API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================================================
# AUTH ROUTER
# =========================================================

app.include_router(
    auth_router
)


# =========================================================
# ROOT
# =========================================================

@app.get("/")
def home():

    return {
        "message": "EcoAvenger API is running"
    }

