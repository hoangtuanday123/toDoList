from fastapi import APIRouter, Depends, HTTPException, Request, status
from typing import Annotated
from core.security import hash_password
from db.database import get_db
from models.role import Role
from models.permissions import Permissions
from models.user import User
from datetime import datetime


router = APIRouter()

@router.post("/setup")
async def setup(db=Depends(get_db))->None:
    user_role=Role(name="user",permissions=[e.value for e in Permissions])
    role_existed= await db.roles.count_documents({"name":user_role.name})
    if role_existed <= 0:
        user_role.created_at=datetime.utcnow()
        user_role.created_by="system"
        json=user_role.model_dump(exclude=["id", "_id", "updated_at","updated_by","deleted_at","deleted_by"])
        await db.roles.insert_one(json)
    user=User(username="user",is_active=True,roles=["user"])
    user_existed= await db.users.count_documents({"username":user.username})
    if user_existed <= 0:
        user.hashed_password=hash_password("user","12345678")
        user.created_at=datetime.utcnow()
        user.created_by="system"
        json=user.model_dump(exclude=["id", "_id", "updated_at","updated_by","deleted_at","deleted_by"])
        await db.users.insert_one(json)
