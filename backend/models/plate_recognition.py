from typing import List
from pydantic import BaseModel, Field

class OCRResponse(BaseModel):
    results: List[str] = Field(..., description="A list of found license plates")
