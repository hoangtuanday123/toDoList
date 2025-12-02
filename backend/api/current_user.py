from fastapi import APIRouter, Depends, HTTPException, Security, status
from typing import Annotated
from core.security import AuthUser,get_current_user
from db.database import get_db
from datetime import datetime
from models.task import Task
from models.base_auditable import PyObjectId
from models.user import User
router = APIRouter()

@router.get("/")
async def get_current_user_info(current_user: Annotated[AuthUser, Security(get_current_user,scopes=["user:read"])])->User:
    return User(id=current_user.id,username=current_user.username,permissions=current_user.permissions)