from fastapi import APIRouter, Depends, HTTPException, Security, status
from typing import Annotated
from core.security import AuthUser,get_current_user
from db.database import get_db
from datetime import datetime,timezone
from models.task import Task
from models.base_auditable import PyObjectId

router = APIRouter()

@router.get("/")
async def list_tasks(current_user: Annotated[AuthUser, Security(get_current_user,scopes=["tasks:read"])],db=Depends(get_db))-> list[Task]:
    return await db.tasks.find({"created_by": current_user.username,"deleted_by": {"$eq": None}}).sort("due_date", 1).to_list()

@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_task(task_in: Task, current_user: Annotated[AuthUser, Security(get_current_user,scopes=["tasks:create"])],db=Depends(get_db))-> Task:
    now_date = datetime.now(timezone.utc).date()
    if task_in.due_date and task_in.due_date.date() < now_date:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Due date cannot be in the past."
        )
    task_in.created_at=datetime.utcnow()
    task_in.created_by=current_user.username
    json=task_in.model_dump(exclude=["id", "_id", "updated_at","updated_by","deleted_at","deleted_by"])
    result=await db.tasks.insert_one(json)
    task=await db.tasks.find_one({"_id":result.inserted_id})
    return task

@router.patch("/")
async def update_task(task_in: Task, current_user: Annotated[AuthUser, Security(get_current_user,scopes=["tasks:update"])],db=Depends(get_db))-> Task:
    now_date = datetime.now(timezone.utc).date()
    task_document=await db.tasks.find_one({"_id":task_in.id})
    if not task_document:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="Task not found")
    if task_in.due_date and task_in.due_date.date() < now_date:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Due date cannot be in the past."
        )
    task_in.updated_at=datetime.utcnow()
    task_in.updated_by=current_user.username
    json=task_in.model_dump(exclude=["id", "_id", "created_at", "created_by","deleted_at","deleted_by"], exclude_unset=True)
    await db.tasks.update_one({"_id":task_in.id},{"$set":json})
    task=await db.tasks.find_one({"_id":task_in.id})
    return task

@router.delete("/{task_id}",status_code=status.HTTP_204_NO_CONTENT)
async def delete_task(task_id: PyObjectId, current_user: Annotated[AuthUser, Security(get_current_user,scopes=["tasks:delete"])],db=Depends(get_db)):
    await db.tasks.update_one({"_id":task_id}, {"$set": {"deleted_by": current_user.username, "deleted_at": datetime.utcnow()}})

@router.get("/search")
async def search_tasks(q: str, current_user: Annotated[AuthUser, Security(get_current_user,scopes=["tasks:read"])],db=Depends(get_db))-> list[Task]:
    regex_pattern = f".*{q}.*"
    search_criteria = {
        "title": {
            "$regex": regex_pattern, 
            "$options": "i"
        },
        "created_by": current_user.username,
        "deleted_by": {"$eq": None}
    }
    tasks=await db.tasks.find(search_criteria).sort("due_date", 1).to_list()
    return tasks

@router.get("/{task_id}")
async def get_task(task_id: PyObjectId, current_user: Annotated[AuthUser, Security(get_current_user,scopes=["tasks:read"])],db=Depends(get_db))-> Task:
    task=await db.tasks.find_one({"_id":task_id, "deleted_by": {"$eq": None}})
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="Task not found")
    return task
