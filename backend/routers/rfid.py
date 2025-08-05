
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
    doc_ref = db.collection("rfid").document(rfid.uid)
    doc_ref.set(rfid.model_dump())
    return rfid

@router.put("/{uid}", response_model=RFIDDocument)
def update_rfid(uid: str, rfid: RFIDDocument, user=Depends(verify_token)):
    db = firestore.client()
    doc_ref = db.collection("rfid").document(uid)
    if not doc_ref.get().exists:
        raise HTTPException(status_code=404, detail="RFID not found")
    doc_ref.update(rfid.model_dump())
    return rfid

@router.delete("/{uid}", status_code=204)
def delete_rfid(uid: str, user=Depends(verify_token)):
    db = firestore.client()
    doc_ref = db.collection("rfid").document(uid)
    if not doc_ref.get().exists:
        raise HTTPException(status_code=404, detail="RFID not found")
    doc_ref.delete()
