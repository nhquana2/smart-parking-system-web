from fastapi import APIRouter, Depends, HTTPException
from models.log import LogDocument
from typing import List, Optional
import firebase_admin
from firebase_admin import firestore
from utils.auth import verify_token
from utils.firebase import *

router = APIRouter(prefix="/logs", tags=["logs"])

@router.get("/", response_model=List[LogDocument])
def list_logs(
    user=Depends(verify_token),
    type: Optional[str] = None
):
    db = firestore.client()
    query = db.collection("logs")
    if type:
        query = query.where("type", "==", type)
    docs = query.order_by("dateLogged", direction=firestore.Query.DESCENDING).stream()
    result = []
    for doc in docs:
        data = doc.to_dict()
        # Add the document ID
        data['id'] = doc.id
        # Convert Firestore timestamp to datetime string for JSON serialization
        if 'dateLogged' in data and data['dateLogged']:
            data['dateLogged'] = data['dateLogged'].isoformat() if hasattr(data['dateLogged'], 'isoformat') else str(data['dateLogged'])
        result.append(LogDocument(**data))
    return result

@router.get("/{log_id}", response_model=LogDocument)
def get_log(log_id: str, user=Depends(verify_token)):
    db = firestore.client()
    doc = db.collection("logs").document(log_id).get()
    if not doc.exists:
        raise HTTPException(status_code=404, detail="Log not found")
    
    data = doc.to_dict()
    # Convert Firestore timestamp to datetime string for JSON serialization
    if 'dateLogged' in data and data['dateLogged']:
        data['dateLogged'] = data['dateLogged'].isoformat() if hasattr(data['dateLogged'], 'isoformat') else str(data['dateLogged'])
    
    return LogDocument(**data)

@router.delete("/{log_id}", status_code=204)
def delete_log(log_id: str, user=Depends(verify_token)):
    db = firestore.client()
    doc_ref = db.collection("logs").document(log_id)
    if not doc_ref.get().exists:
        raise HTTPException(status_code=404, detail="Log not found")
    doc_ref.delete()
