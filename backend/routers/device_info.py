from fastapi import APIRouter, HTTPException, Depends
from models.device_info import DeviceInfo
from firebase_admin import firestore
from utils.auth import verify_token
from utils.firebase import *
from datetime import datetime

router = APIRouter(prefix="/device-info", tags=["device_info"])

@router.get("/", response_model=DeviceInfo, summary="Get device information")
async def get_device_info(current_user: dict = Depends(verify_token)):
    try:
        db = firestore.client()
        doc_ref = db.collection("deviceInfo").document("defaultInfo")
        doc = doc_ref.get()
        
        if not doc.exists:
            raise HTTPException(status_code=404, detail="Device info not found")
        
        data = doc.to_dict()
        
        # Convert Firestore timestamps to datetime objects
        device_info = DeviceInfo(
            camLastRead=data["camLastRead"],
            rfidLastRead=data["rfidLastRead"],
            rfidUID=data["rfidUID"]
        )
        
        return device_info
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching device info: {str(e)}")

@router.put("/", response_model=DeviceInfo, summary="Update device information")
async def update_device_info(
    device_info: DeviceInfo,
    current_user: dict = Depends(verify_token)
):
    try:
        db = firestore.client()
        doc_ref = db.collection("deviceInfo").document("defaultInfo")
        
        # Convert datetime objects to Firestore timestamps
        update_data = {
            "camLastRead": device_info.camLastRead,
            "rfidLastRead": device_info.rfidLastRead,
            "rfidUID": device_info.rfidUID
        }
        
        doc_ref.set(update_data, merge=True)
        
        return device_info
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating device info: {str(e)}")
