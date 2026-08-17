import bcrypt
from jose import jwt, JWTError
from datetime import datetime, timedelta, timezone


# =========================================================
# JWT CONFIGURATION
# =========================================================

SECRET_KEY = "ecoavenger-secret-key-change-this-later"

ALGORITHM = "HS256"

ACCESS_TOKEN_EXPIRE_MINUTES = 60


# =========================================================
# PASSWORD HASH
# =========================================================

def hash_password(password: str) -> str:

    if not password:
        raise ValueError("Password cannot be empty")

    password_bytes = password.encode("utf-8")

    # bcrypt maximum = 72 bytes
    if len(password_bytes) > 72:
        raise ValueError(
            "Password cannot be longer than 72 bytes"
        )

    hashed = bcrypt.hashpw(
        password_bytes,
        bcrypt.gensalt()
    )

    return hashed.decode("utf-8")


# =========================================================
# PASSWORD VERIFY
# =========================================================

def verify_password(
    password: str,
    hashed_password: str
) -> bool:

    if not password or not hashed_password:
        return False

    password_bytes = password.encode("utf-8")

    if len(password_bytes) > 72:
        return False

    try:

        return bcrypt.checkpw(
            password_bytes,
            hashed_password.encode("utf-8")
        )

    except Exception:

        return False


# =========================================================
# CREATE JWT
# =========================================================

def create_access_token(user_id: str):

    expire = datetime.now(timezone.utc) + timedelta(
        minutes=ACCESS_TOKEN_EXPIRE_MINUTES
    )

    payload = {
        "user_id": str(user_id),
        "exp": expire
    }

    token = jwt.encode(
        payload,
        SECRET_KEY,
        algorithm=ALGORITHM
    )

    return token


# =========================================================
# DECODE JWT
# =========================================================

def decode_access_token(token: str):

    if not token:
        return None

    try:

        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        return payload

    except JWTError:

        return None

    except Exception:

        return None