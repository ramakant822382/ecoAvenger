from fastapi import (
    APIRouter,
    HTTPException,
    Depends
)

from fastapi.security import (
    HTTPBearer,
    HTTPAuthorizationCredentials
)

from pydantic import BaseModel, EmailStr

from bson import ObjectId

from database import users_collection

from utils.auth import (
    hash_password,
    verify_password,
    create_access_token,
    decode_access_token
)


# =========================================================
# ROUTER
# =========================================================

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


# =========================================================
# SECURITY
# =========================================================

security = HTTPBearer()


# =========================================================
# REQUEST MODELS
# =========================================================

class UserRegister(BaseModel):

    name: str
    email: EmailStr
    password: str


class UserLogin(BaseModel):

    email: EmailStr
    password: str


# =========================================================
# REGISTER
# =========================================================

@router.post("/register")
def register(user: UserRegister):

    # -----------------------------------------------------
    # Check existing user
    # -----------------------------------------------------

    existing_user = users_collection.find_one({
        "email": user.email
    })

    if existing_user:

        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    # -----------------------------------------------------
    # Validate password
    # -----------------------------------------------------

    if len(user.password.encode("utf-8")) > 72:

        raise HTTPException(
            status_code=400,
            detail="Password cannot be longer than 72 bytes"
        )

    # -----------------------------------------------------
    # Hash password
    # -----------------------------------------------------

    hashed_password = hash_password(
        user.password
    )

    # -----------------------------------------------------
    # Create user
    # -----------------------------------------------------

    new_user = {

        "name": user.name,

        "email": user.email,

        "password": hashed_password,

        # Enovenger / EcoAvenger data
        "points": 0,

        "level": 1,

        "plastic_count": 0
    }

    # -----------------------------------------------------
    # Insert into MongoDB
    # -----------------------------------------------------

    result = users_collection.insert_one(
        new_user
    )

    # -----------------------------------------------------
    # Response
    # -----------------------------------------------------

    return {

        "message": "Registration successful",

        "user_id": str(
            result.inserted_id
        )
    }


# =========================================================
# LOGIN
# =========================================================

@router.post("/login")
def login(user: UserLogin):

    # -----------------------------------------------------
    # Find user
    # -----------------------------------------------------

    existing_user = users_collection.find_one({

        "email": user.email

    })

    if not existing_user:

        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    # -----------------------------------------------------
    # Verify password
    # -----------------------------------------------------

    password_correct = verify_password(

        user.password,

        existing_user["password"]
    )

    if not password_correct:

        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    # -----------------------------------------------------
    # Create JWT token
    # -----------------------------------------------------

    access_token = create_access_token(

        str(existing_user["_id"])

    )

    # -----------------------------------------------------
    # Response
    # -----------------------------------------------------

    return {

        "message": "Login successful",

        "access_token": access_token,

        "token_type": "bearer"
    }


# =========================================================
# PROFILE
# =========================================================

@router.get("/profile")
def profile(

    credentials: HTTPAuthorizationCredentials = Depends(
        security
    )

):

    # -----------------------------------------------------
    # Get token
    # -----------------------------------------------------

    token = credentials.credentials

    # -----------------------------------------------------
    # Decode token
    # -----------------------------------------------------

    payload = decode_access_token(
        token
    )

    if not payload:

        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token"
        )

    # -----------------------------------------------------
    # Get user ID
    # -----------------------------------------------------

    user_id = payload.get(
        "user_id"
    )

    if not user_id:

        raise HTTPException(
            status_code=401,
            detail="Invalid token"
        )

    # -----------------------------------------------------
    # Convert string ID to ObjectId
    # -----------------------------------------------------

    try:

        object_id = ObjectId(
            user_id
        )

    except Exception:

        raise HTTPException(
            status_code=401,
            detail="Invalid user ID"
        )

    # -----------------------------------------------------
    # Find user
    # -----------------------------------------------------

    user = users_collection.find_one({

        "_id": object_id

    })

    if not user:

        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    # -----------------------------------------------------
    # Return profile
    # -----------------------------------------------------

    return {

        "name": user.get(
            "name",
            ""
        ),

        "email": user.get(
            "email",
            ""
        ),

        "points": user.get(
            "points",
            0
        ),

        "level": user.get(
            "level",
            1
        ),

        "plastic_count": user.get(
            "plastic_count",
            0
        )
    }