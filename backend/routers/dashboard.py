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
        
        # Build response with only non-zero values
        response = {}
        if vehicles_in_parking > 0:
            response["vehiclesInParking"] = vehicles_in_parking
        if active_rfid_count > 0:
            response["activeRfidCount"] = active_rfid_count
        if today_revenue > 0:
            response["todayRevenue"] = today_revenue
        if base_price > 0:
            response["basePricePerHour"] = base_price
        
        return response
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get dashboard stats: {str(e)}")

@router.get("/chart-data")
async def get_chart_data(user=Depends(verify_token)):
    """Get chart data for revenue and vehicle count over time"""
    try:
        db = firestore.client()
        vehicles_ref = db.collection("vehicles")
        
        # Get all vehicles with exit status
        exit_vehicles = vehicles_ref.where("status", "==", "exit").stream()
        
        # Group data by date
        daily_data = {}
        
        for vehicle_doc in exit_vehicles:
            vehicle_data = vehicle_doc.to_dict()
            if vehicle_data.get("timeOut"): 
                # Convert Firestore timestamp to datetime
                time_out = vehicle_data["timeOut"]
                if hasattr(time_out, 'timestamp'):
                    time_out_dt = datetime.fromtimestamp(time_out.timestamp())
                else:
                    time_out_dt = time_out
                
                date_str = time_out_dt.strftime("%Y-%m-%d")
                
                if date_str not in daily_data:
                    daily_data[date_str] = {
                        "date": date_str,
                        "revenue": 0,
                        "vehicleCount": 0
                    }
                
                daily_data[date_str]["revenue"] += vehicle_data.get("fee", 0)
                daily_data[date_str]["vehicleCount"] += 1
        
        # Generate data for the last 90 days (exclude days with zero values)
        end_date = datetime.now().date()
        start_date = end_date - timedelta(days=90)
        
        chart_data = []
        current_date = start_date
        
        while current_date <= end_date:
            date_str = current_date.strftime("%Y-%m-%d")
            
            if date_str in daily_data:
                # Only include entries with non-zero values
                data_entry = {"date": date_str}
                if daily_data[date_str]["revenue"] > 0:
                    data_entry["revenue"] = daily_data[date_str]["revenue"]
                if daily_data[date_str]["vehicleCount"] > 0:
                    data_entry["vehicleCount"] = daily_data[date_str]["vehicleCount"]
                
                # Only add to chart_data if there's at least one non-zero value
                if len(data_entry) > 1:  # More than just the date field
                    chart_data.append(data_entry)
            
            current_date += timedelta(days=1)
        
        return {"chartData": chart_data}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get chart data: {str(e)}")
