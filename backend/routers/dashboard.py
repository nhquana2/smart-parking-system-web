from fastapi import APIRouter, HTTPException, Depends
from datetime import datetime, timedelta
import firebase_admin
from firebase_admin import firestore
from utils.auth import verify_token
from utils.firebase import *

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("/stats")
async def get_dashboard_stats(user=Depends(verify_token)):
    """Get dashboard statistics"""
    try:
        db = firestore.client()
        
        # Get vehicles currently parking
        vehicles_ref = db.collection("vehicles")
        parking_vehicles = vehicles_ref.where("status", "==", "parking").stream()
        vehicles_in_parking = len(list(parking_vehicles))
        
        # Get active RFID cards
        rfid_ref = db.collection("rfid")
        active_rfids = rfid_ref.where("status", "==", "active").stream()
        active_rfid_count = len(list(active_rfids))
        
        # Get today's revenue (vehicles with status "exit" from today)
        today_start = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
        today_revenue = 0
        
        exit_vehicles = vehicles_ref.where("status", "==", "exit").stream()
        for vehicle_doc in exit_vehicles:
            vehicle_data = vehicle_doc.to_dict()
            if vehicle_data.get("timeOut"):
                # Convert Firestore timestamp to datetime
                time_out = vehicle_data["timeOut"]
                if hasattr(time_out, 'timestamp'):
                    time_out_dt = datetime.fromtimestamp(time_out.timestamp())
                else:
                    time_out_dt = time_out
                
                # Check if vehicle exited today
                if time_out_dt.date() == today_start.date():
                    today_revenue += vehicle_data.get("fee", 0)
        
        # Get base price from fee configuration
        fee_config_ref = db.collection("feeConfig").document("defaultFee")
        fee_config_doc = fee_config_ref.get()
        
        base_price = 0  # Default value
        if fee_config_doc.exists:
            fee_data = fee_config_doc.to_dict()
            base_price = fee_data.get("pricePerHour", 0)
        
        return {
            "vehiclesInParking": vehicles_in_parking,
            "activeRfidCount": active_rfid_count,
            "todayRevenue": today_revenue,
            "basePricePerHour": base_price
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get dashboard stats: {str(e)}")
