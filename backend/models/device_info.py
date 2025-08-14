from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class DeviceInfo(BaseModel):
    camLastRead: datetime
    rfidLastRead: datetime
    rfidUID: str
