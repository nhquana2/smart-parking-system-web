from pydantic import BaseModel, Field
from typing import Optional

class FeeConfig(BaseModel):
    pricePerHour: Optional[float] = Field(None, description="Price per hour in VND")
    multiplier: Optional[float] = Field(None, description="Multiplier for additional hours")
    maximumPrice: Optional[float] = Field(None, description="Maximum price per day in VND")
    additionalCharge: Optional[float] = Field(None, description="Additional charge for services in VND")
