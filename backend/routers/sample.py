from fastapi import APIRouter

router = APIRouter()

@router.get("/sample")
def get_sample():
    return {"message": "Sample endpoint"}
