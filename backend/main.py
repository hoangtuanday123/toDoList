import uvicorn
from core.config import configs

if __name__ == "__main__":
    uvicorn.run(
        "app:app",
        host=configs.HOST,
        port=configs.PORT,
        reload=configs.DEBUG_MODE,
    )