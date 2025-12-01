from enum import Enum

class Permissions(str, Enum):
    tasks_read = "tasks:read"
    tasks_create = "tasks:create"
    tasks_update = "tasks:update"
    tasks_delete = "tasks:delete"
    