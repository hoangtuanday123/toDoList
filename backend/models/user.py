from models.base_auditable import BaseAuditable
from typing import Optional
from pydantic import  SecretStr

class User(BaseAuditable):
    username: str
    hashed_password: Optional[SecretStr] = None
    is_active: bool = True
    roles: list[str] = []
    permissions: list[str] = []