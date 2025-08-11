from fastapi import APIRouter, HTTPException, Depends
from models.fee_config import FeeConfig
import firebase_admin
from firebase_admin import firestore
from utils.auth import verify_token
from utils.firebase import *

router = APIRouter(prefix="/fee-config", tags=["Fee Configuration"])

@router.get("/")
async def get_fee_config(user=Depends(verify_token)):
    """Get fee configuration"""
    try:
        db = firestore.client()
        doc_ref = db.collection("feeConfig").document("defaultFee")
        doc = doc_ref.get()
        
        if not doc.exists:
            # Create default fee configuration if it doesn't exist
            default_config = {
                "pricePerHour": 5000,
                "multiplier": 1.5,
                "maximumPrice": 50000,
                "additionalCharge": 2000
            }
            doc_ref.set(default_config)
            return default_config
        
        return doc.to_dict()
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get fee configuration: {str(e)}")

@router.put("/")
async def update_fee_config(
    fee_config: FeeConfig,
    user=Depends(verify_token)
):
    """Update fee configuration"""
    try:
        db = firestore.client()
        doc_ref = db.collection("feeConfig").document("defaultFee")
        
        # Get current data
        doc = doc_ref.get()
        current_data = doc.to_dict() if doc.exists else {}
        
        # Update only provided fields
        update_data = {}
        if fee_config.pricePerHour is not None:
            update_data["pricePerHour"] = fee_config.pricePerHour
        if fee_config.multiplier is not None:
            update_data["multiplier"] = fee_config.multiplier
        if fee_config.maximumPrice is not None:
            update_data["maximumPrice"] = fee_config.maximumPrice
        if fee_config.additionalCharge is not None:
            update_data["additionalCharge"] = fee_config.additionalCharge
        
        if update_data:
            doc_ref.update(update_data) if doc.exists else doc_ref.set(update_data)
            current_data.update(update_data)
        
        return current_data
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update fee configuration: {str(e)}")
