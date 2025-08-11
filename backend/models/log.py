from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class LogDocument(BaseModel):
    id: Optional[str] = Field(None, description="Document ID")
    type: str = Field(..., description="Log type: vehicle_in, vehicle_out, or device")
    message: str = Field(..., description="Log message")
    dateLogged: Optional[datetime] = Field(None, description="Date when log was created")
