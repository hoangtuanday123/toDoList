from fastapi import APIRouter, Security
from typing import Annotated
from core.security import AuthUser,get_current_user
from models.user import User
router = APIRouter()

@router.get("/")
async def get_current_user_info(current_user: Annotated[AuthUser, Security(get_current_user,scopes=["user:read"])])->User:
    return User(id=current_user.id,username=current_user.username,permissions=current_user.permissions)