import os
from dotenv import load_dotenv

load_dotenv()


class Configurations:
    PROJECT_NAME:str= os.getenv("PROJECT_NAME", "TO DO LIST API")
    PROJECT_VERSION: str = os.getenv("PROJECT_VERSION", "1.0.0")

    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", "8000"))

    DEBUG_MODE: bool = os.getenv("DEBUG_MODE", 'True').lower() == 'true'

    DATABASE_URL: str = os.getenv("DATABASE_URL")    
    DATABASE_NAME: str = os.getenv("DATABASE_NAME")

configs = Configurations()