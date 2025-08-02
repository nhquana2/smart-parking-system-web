from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class VehicleDocument(BaseModel):
    licensePlate: str
    rfidUID: str
    status: str
    timeIn: datetime
    timeOut: Optional[datetime] = None
