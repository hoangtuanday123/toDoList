from models.base_auditable import BaseAuditable
from typing import Optional
from enum import Enum
from datetime import datetime

class Priority(str, Enum):
    LOW = "low"
    NORMAL = "normal"
    HIGH = "high"

class Task(BaseAuditable):
    title: str
    description: Optional[str] = None
    due_date: Optional[datetime] = datetime.utcnow
    priority: Priority = Priority.NORMAL
    is_completed: bool = False