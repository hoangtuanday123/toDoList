from models.base_auditable import BaseAuditable
from models.permissions import Permissions

class Role(BaseAuditable):
    name: str
    is_default: bool | None = False
    permissions: list[Permissions]