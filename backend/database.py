import os

from pymongo import MongoClient
from dotenv import load_dotenv


# Load .env
load_dotenv()


# =========================================================
# ENVIRONMENT VARIABLES
# =========================================================

MONGO_URL = os.getenv("MONGO_URL")
DATABASE_NAME = os.getenv("DATABASE_NAME")


if not MONGO_URL:
    raise ValueError(
        "MONGO_URL is missing in .env file"
    )

if not DATABASE_NAME:
    raise ValueError(
        "DATABASE_NAME is missing in .env file"
    )


# =========================================================
# MONGODB CONNECTION
# =========================================================

client = MongoClient(MONGO_URL)

db = client[DATABASE_NAME]

users_collection = db["users"]


# =========================================================
# TEST CONNECTION
# =========================================================

try:

    client.admin.command("ping")

    print("MongoDB connected successfully")
    print("Database:", DATABASE_NAME)

except Exception as e:

    print("MongoDB connection failed:", e)