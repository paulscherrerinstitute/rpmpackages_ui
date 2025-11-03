from fastapi import APIRouter

router = APIRouter()


@router.get("/health", description="Simply tests connectivity")
def healthcheck():
    return {"message": "Alive and Well!"}
