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
    status: Optional[str] = None
):
    db = firestore.client()
    query = db.collection("vehicles")
    if status:
        query = query.where("status", "==", status)
    docs = query.stream()
    result = []
    for doc in docs:
        data = doc.to_dict()
        data["id"] = doc.id
        result.append(VehicleDocument(**data))
    return result

@router.get("/{doc_id}", response_model=VehicleDocument)
def get_vehicle(doc_id: str, user=Depends(verify_token)):
    db = firestore.client()
    doc = db.collection("vehicles").document(doc_id).get()
    if not doc.exists:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    data = doc.to_dict()
    data["id"] = doc.id
    return VehicleDocument(**data)

@router.put("/{doc_id}", response_model=VehicleDocument)
def update_vehicle(doc_id: str, vehicle: VehicleDocument, user=Depends(verify_token)):
    db = firestore.client()
    doc_ref = db.collection("vehicles").document(doc_id)
    doc = doc_ref.get()
    if not doc.exists:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    data = doc.to_dict()
    if data["rfidUID"] != vehicle.rfidUID:
        raise HTTPException(status_code=400, detail="rfidUID cannot be changed")
    
    update_data = vehicle.model_dump(exclude={"id"})
    doc_ref.update(update_data)
    
    updated_vehicle = vehicle.model_copy()
    updated_vehicle.id = doc_id
    return updated_vehicle

@router.delete("/{doc_id}", status_code=204)
def delete_vehicle(doc_id: str, user=Depends(verify_token)):
    db = firestore.client()
    doc_ref = db.collection("vehicles").document(doc_id)
    doc = doc_ref.get()
    if not doc.exists:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    # Allow deleting vehicles regardless of status
    doc_ref.delete()
