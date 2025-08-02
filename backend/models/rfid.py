from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class RFIDDocument(BaseModel):
    uid: str
    balance: float
    dateAdded: datetime
    status: str
