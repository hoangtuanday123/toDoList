from fastapi import APIRouter, Depends, HTTPException, Request, status
from typing import Annotated
from core.security import AuthUser,get_current_user
from db.database import get_db
from datetime import datetime


router = APIRouter()

@router.get("/tasks")
async def get_tasks(current_user: Annotated[AuthUser, Depends(get_current_user)], db=Depends(get_db))->list[str]:
    if not current_user.is_authenticated:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")
    return ["Task 1", "Task 2", "Task 3"]