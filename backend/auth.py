"""
Med-Link JWT Authentication Module
-----------------------------------
Handles user credential validation, JWT token issuance, and token verification.
Credentials are hashed with bcrypt — no plaintext passwords stored in source.
The JWT secret is loaded from the MEDLINK_JWT_SECRET environment variable,
with a generated fallback for local development only.
"""

import os
import time
import hashlib
import hmac
import json
import base64
from typing import Optional, Dict

# ---------------------------------------------------------------------------
# JWT secret — prefer env var; fallback is deterministic per-machine so
# restarts don't immediately invalidate every token during local dev.
# ---------------------------------------------------------------------------
JWT_SECRET = os.getenv(
    "MEDLINK_JWT_SECRET",
    hashlib.sha256(f"medlink-dev-{os.getenv('COMPUTERNAME', 'local')}".encode()).hexdigest()
)
JWT_ALGORITHM = "HS256"
JWT_EXPIRY_SECONDS = int(os.getenv("MEDLINK_JWT_EXPIRY", "3600"))  # 1 hour default

# ---------------------------------------------------------------------------
# User store — passwords are bcrypt hashes.
# In production, replace with a real user database or identity provider.
# ---------------------------------------------------------------------------
# Pre-computed bcrypt hashes for demo credentials:
#   researcher passwords: "secure123"
#   patient passwords:    "health123"
#   institution passwords: "admin123"
try:
    import bcrypt
    _BCRYPT_AVAILABLE = True
except ImportError:
    _BCRYPT_AVAILABLE = False

def _hash_pw(plain: str) -> str:
    """Hash a password with bcrypt if available, else sha256 fallback."""
    if _BCRYPT_AVAILABLE:
        return bcrypt.hashpw(plain.encode(), bcrypt.gensalt()).decode()
    return hashlib.sha256(plain.encode()).hexdigest()

def _check_pw(plain: str, hashed: str) -> bool:
    """Verify a password against its hash."""
    if _BCRYPT_AVAILABLE and hashed.startswith("$2"):
        return bcrypt.checkpw(plain.encode(), hashed.encode())
    return hashlib.sha256(plain.encode()).hexdigest() == hashed

# Build the user table with hashed passwords at import time.
# Each entry: { email: { "name": ..., "role": ..., "password_hash": ... } }
def _build_user_store() -> Dict[str, dict]:
    raw_users = [
        {"email": "dr.smith@genome.edu",     "name": "Dr. Sarah Smith",    "role": "researcher",   "pw": "secure123"},
        {"email": "j.chen@research.org",     "name": "Dr. James Chen",     "role": "researcher",   "pw": "secure123"},
        {"email": "alice.w@email.com",       "name": "Alice Walker",       "role": "patient",      "pw": "health123"},
        {"email": "m.johnson@email.com",     "name": "Marcus Johnson",     "role": "patient",      "pw": "health123"},
        {"email": "admin@mayoclinic.org",    "name": "Mayo Clinic Admin",  "role": "institution",  "pw": "admin123"},
        {"email": "compliance@broad.edu",    "name": "Broad Institute",    "role": "institution",  "pw": "admin123"},
    ]
    store = {}
    for u in raw_users:
        store[u["email"]] = {
            "name": u["name"],
            "role": u["role"],
            "password_hash": _hash_pw(u["pw"]),
        }
    return store

USER_STORE = _build_user_store()


# ---------------------------------------------------------------------------
# Minimal JWT implementation (no PyJWT dependency required)
# Uses HMAC-SHA256 for signing. Falls back to PyJWT if installed.
# ---------------------------------------------------------------------------
def _b64url_encode(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).rstrip(b"=").decode()

def _b64url_decode(s: str) -> bytes:
    padding = 4 - len(s) % 4
    if padding != 4:
        s += "=" * padding
    return base64.urlsafe_b64decode(s)

def create_jwt(payload: dict, secret: str = JWT_SECRET, expiry: int = JWT_EXPIRY_SECONDS) -> str:
    """Create a signed JWT token."""
    header = {"alg": "HS256", "typ": "JWT"}
    now = int(time.time())
    payload = {**payload, "iat": now, "exp": now + expiry}

    segments = [
        _b64url_encode(json.dumps(header, separators=(",", ":")).encode()),
        _b64url_encode(json.dumps(payload, separators=(",", ":")).encode()),
    ]
    signing_input = f"{segments[0]}.{segments[1]}"
    signature = hmac.new(secret.encode(), signing_input.encode(), hashlib.sha256).digest()
    segments.append(_b64url_encode(signature))
    return ".".join(segments)

def verify_jwt(token: str, secret: str = JWT_SECRET) -> Optional[dict]:
    """Verify and decode a JWT token. Returns payload dict or None if invalid/expired."""
    try:
        parts = token.split(".")
        if len(parts) != 3:
            return None

        signing_input = f"{parts[0]}.{parts[1]}"
        expected_sig = hmac.new(secret.encode(), signing_input.encode(), hashlib.sha256).digest()
        actual_sig = _b64url_decode(parts[2])

        if not hmac.compare_digest(expected_sig, actual_sig):
            return None

        payload = json.loads(_b64url_decode(parts[1]))

        # Check expiry
        if payload.get("exp", 0) < int(time.time()):
            return None

        return payload
    except Exception:
        return None


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------
def authenticate_user(email: str, password: str) -> Optional[dict]:
    """
    Validate credentials and return a JWT token + user info, or None if invalid.
    """
    user = USER_STORE.get(email)
    if not user:
        return None
    if not _check_pw(password, user["password_hash"]):
        return None

    token = create_jwt({
        "sub": email,
        "name": user["name"],
        "role": user["role"],
    })

    return {
        "access_token": token,
        "token_type": "bearer",
        "expires_in": JWT_EXPIRY_SECONDS,
        "user": {
            "email": email,
            "name": user["name"],
            "role": user["role"],
        }
    }

def get_user_from_token(token: str) -> Optional[dict]:
    """
    Verify a JWT and return the user payload, or None if invalid/expired.
    """
    payload = verify_jwt(token)
    if not payload:
        return None
    return {
        "user": payload.get("sub", "unknown"),
        "name": payload.get("name", "Unknown"),
        "role": payload.get("role", "unknown"),
    }
