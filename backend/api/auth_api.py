from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from core.security import Token,verify_password,create_access_token,AuthUser
from db.database import get_db
from models.role import Role
from models.user import User
from typing import Annotated

router = APIRouter()

@router.post("/login")
async def login(form_data: Annotated[OAuth2PasswordRequestForm, Depends()],db=Depends(get_db))->Token:
    document=await db.users.find_one({"username":form_data.username.lower()})
    if not document:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,detail="Invalid username or password")
    
    user=User(**document)
    if user.hashed_password._secret_value != '' and not verify_password(form_data.username.lower(),form_data.password,user.hashed_password._secret_value):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,detail="Invalid username or password")
    
    if user.is_active == False:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Account deactivated")
    
    user_roles=await db.roles.find({"name":{"$in":user.roles}}).to_list(length=None)
    user_permissions = []
    for r in user_roles:
        role = Role(**r)
        user_permissions.extend(role.permissions)
    token_str=create_access_token(AuthUser(id=str(user.id),username=user.username,permissions=set(user_permissions)))
    return Token(access_token=token_str, token_type="bearer")