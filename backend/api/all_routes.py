from fastapi import APIRouter
from api import user_api,auth_api,task_api
router = APIRouter()
router.include_router(user_api.router, prefix="/users", tags=["users"])
router.include_router(auth_api.router, prefix="/auth", tags=["auth"])
router.include_router(task_api.router, prefix="/tasks", tags=["tasks"])