from pwdlib import PasswordHash
from pydantic import BaseModel
import datetime
import jwt
from jwt.exceptions import InvalidTokenError
from fastapi.security import OAuth2PasswordBearer,SecurityScopes
from fastapi import Depends,  HTTPException, status
from typing import Annotated
password_hash = PasswordHash.recommended()

SECRET_KEY = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 525600
oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="auth/login",
    scopes={"user": "*", "items": "Read items."},
    auto_error=False
)

class AuthUser(BaseModel):
    id: str | None = None
    username: str | None = None
    permissions: list[str] = []
    is_authenticated:bool = True

class Token(BaseModel):
    access_token: str
    token_type: str

def hash_password(username,password):
    return password_hash.hash(username+'@'+password)

def verify_password(username,plain_password, hashed_password):
    return password_hash.verify(username+'@'+plain_password, hashed_password)

def encode_token(payload:str):
    return jwt.encode(payload, key=SECRET_KEY, algorithm=ALGORITHM)

def decode_token(payload:str):
    return jwt.decode(payload, SECRET_KEY, algorithms=[ALGORITHM])

def create_access_token(user:AuthUser)->str:
    payload={
        "sub": user.username,
        "id": user.id,
        "scopes": user.permissions,
        'iat': datetime.datetime.utcnow(),
        'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES),
    }
    token=encode_token(payload)
    return token

async def get_current_user(
    security_scopes: SecurityScopes, token: Annotated[str, Depends(oauth2_scheme)]
):
    if security_scopes.scopes:
        authenticate_value = f'Bearer scope="{security_scopes.scope_str}"'
    else:
        authenticate_value = "Bearer"
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": authenticate_value},
    )
    try:
        payload = decode_token(token)
        username = payload.get("sub")
        if username is None:
            raise credentials_exception
        scopes = payload.get('scopes', [])
    except (InvalidTokenError):
        raise credentials_exception
    for scope in security_scopes.scopes:
        if scope not in scopes:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Not enough permissions",
                headers={"WWW-Authenticate": authenticate_value},
            )
    return AuthUser(username=username, id=payload.get("id"), permissions=scopes)

