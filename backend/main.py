from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.auth import router as auth_router
from fastapi import UploadFile, File
from PIL import Image
import io

from ml.plastic_detector import detect_plastic

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


@app.post("/plastic/detect")
async def plastic_detect(
    file: UploadFile = File(...)
):

    image_bytes = await file.read()

    image = Image.open(
        io.BytesIO(image_bytes)
    ).convert("RGB")

    result = detect_plastic(image)

    return result