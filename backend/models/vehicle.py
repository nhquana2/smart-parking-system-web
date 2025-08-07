from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class VehicleDocument(BaseModel):
    id: Optional[str] = None
    licensePlate: str
    rfidUID: str
    status: str
    timeIn: datetime
    timeOut: Optional[datetime] = None
    fee: Optional[float] = None
