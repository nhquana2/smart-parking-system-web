from fastapi import APIRouter, Depends, HTTPException, status
from models.vehicle import VehicleDocument
from typing import List, Optional
from firebase_admin import firestore
from utils.auth import verify_token
from utils.firebase import *

router = APIRouter(prefix="/vehicles", tags=["vehicles"])

@router.get("/", response_model=List[VehicleDocument])
def list_vehicles(
    user=Depends(verify_token),
    status: Optional[str] = None,
    limit: int = 20,
    offset: int = 0
):
    db = firestore.client()
    query = db.collection("vehicles")
    if status:
        query = query.where("status", "==", status)
    query = query.order_by("timeIn").offset(offset).limit(limit)
    docs = query.stream()
    result = []
    for doc in docs:
        data = doc.to_dict()
        result.append(VehicleDocument(**data))
    return result

@router.get("/{licensePlate}", response_model=VehicleDocument)
def get_vehicle(licensePlate: str, user=Depends(verify_token)):
    db = firestore.client()
    docs = db.collection("vehicles").where("licensePlate", "==", licensePlate).limit(1).stream()
    for doc in docs:
        return VehicleDocument(**doc.to_dict())
    raise HTTPException(status_code=404, detail="Vehicle not found")

@router.put("/{licensePlate}", response_model=VehicleDocument)
def update_vehicle(licensePlate: str, vehicle: VehicleDocument, user=Depends(verify_token)):
    db = firestore.client()
    docs = db.collection("vehicles").where("licensePlate", "==", licensePlate).limit(1).stream()
    for doc in docs:
        data = doc.to_dict()
        if data["rfidUID"] != vehicle.rfidUID:
            raise HTTPException(status_code=400, detail="rfidUID cannot be changed")
        doc_ref = db.collection("vehicles").document(doc.id)
        doc_ref.update(vehicle.model_dump())
        return vehicle
    raise HTTPException(status_code=404, detail="Vehicle not found")

@router.delete("/{licensePlate}", status_code=204)
def delete_vehicle(licensePlate: str, user=Depends(verify_token)):
    db = firestore.client()
    docs = db.collection("vehicles").where("licensePlate", "==", licensePlate).limit(1).stream()
    for doc in docs:
        data = doc.to_dict()
        if data["status"] != "parking":
            raise HTTPException(status_code=400, detail="Only vehicles with status 'parking' can be deleted")
        doc_ref = db.collection("vehicles").document(doc.id)
        doc_ref.delete()
        return
    raise HTTPException(status_code=404, detail="Vehicle not found")
