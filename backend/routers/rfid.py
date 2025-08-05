
from fastapi import APIRouter, Depends, HTTPException, status
from models.rfid import RFIDDocument
from typing import List
import firebase_admin
from firebase_admin import firestore
from utils.auth import verify_token
from utils.firebase import *

router = APIRouter(prefix="/rfid", tags=["rfid"])


@router.get("/", response_model=List[RFIDDocument])
def list_rfid(
    user=Depends(verify_token)
):
    db = firestore.client()
    docs = db.collection("rfid").order_by("dateAdded").stream()
    result = []
    for doc in docs:
        data = doc.to_dict()
        result.append(RFIDDocument(**data))
    return result

@router.get("/{uid}", response_model=RFIDDocument)
def get_rfid(uid: str, user=Depends(verify_token)):
    db = firestore.client()
    doc = db.collection("rfid").document(uid).get()
    if not doc.exists:
        raise HTTPException(status_code=404, detail="RFID not found")
    return RFIDDocument(**doc.to_dict())

@router.post("/", response_model=RFIDDocument, status_code=201)
def create_rfid(rfid: RFIDDocument, user=Depends(verify_token)):
    db = firestore.client()
    
    # Check if RFID with this UID already exists
    existing_doc = db.collection("rfid").document(rfid.uid).get()
    if existing_doc.exists:
        raise HTTPException(status_code=400, detail="RFID with this UID already exists")
    
    # Create the document with server timestamp
    rfid_data = rfid.model_dump()
    rfid_data['dateAdded'] = firestore.SERVER_TIMESTAMP
    
    doc_ref = db.collection("rfid").document(rfid.uid)
    doc_ref.set(rfid_data)
    
    return rfid

@router.put("/{uid}", response_model=RFIDDocument)
def update_rfid(uid: str, rfid: RFIDDocument, user=Depends(verify_token)):
    db = firestore.client()
    doc_ref = db.collection("rfid").document(uid)
    
    if not doc_ref.get().exists:
        raise HTTPException(status_code=404, detail="RFID not found")
    
    # Ensure the UID in the body matches the URL parameter
    if rfid.uid != uid:
        raise HTTPException(status_code=400, detail="UID cannot be changed")
    
    # Update only allowed fields (exclude dateAdded to preserve original)
    update_data = {
        'balance': rfid.balance,
        'status': rfid.status
    }
    
    doc_ref.update(update_data)
    return rfid

@router.delete("/{uid}", status_code=204)
def delete_rfid(uid: str, user=Depends(verify_token)):
    db = firestore.client()
    doc_ref = db.collection("rfid").document(uid)
    if not doc_ref.get().exists:
        raise HTTPException(status_code=404, detail="RFID not found")
    doc_ref.delete()
