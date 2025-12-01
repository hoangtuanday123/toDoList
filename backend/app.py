from contextlib import asynccontextmanager
from fastapi import FastAPI,Depends
from core.config import configs
from fastapi.openapi.docs import get_swagger_ui_html
from db.database import db_connect,db_disconnect
from api import all_routes
def start_app():
    app = FastAPI(
        title=configs.PROJECT_NAME , 
        version=configs.PROJECT_VERSION, 
        debug=configs.DEBUG_MODE, 
        lifespan=lifespan,
        docs_url=None,
        openapi_url="/api/openapi.json",
        separate_input_output_schemas=False
    )

    app.include_router(all_routes.router, prefix="/api")
    @app.get("/api/docs", include_in_schema=False)
    async def custom_swagger_ui_html():
        return get_swagger_ui_html(
            openapi_url=app.openapi_url,
            title=app.title + " - Swagger UI", 
            oauth2_redirect_url=app.swagger_ui_oauth2_redirect_url
        )
    
    return app

@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        # logging.debug("APP STARTUP")
        await db_connect()
        yield
    finally:
        # logging.debug("APP SHUTDOWN")
        await db_disconnect()

app = start_app()