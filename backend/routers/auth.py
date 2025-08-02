from fastapi import APIRouter, HTTPException, status, Request
from models.user import SignUpRequest, SignInRequest

import requests
from utils.firebase import *
from firebase_admin import auth as firebase_auth

router = APIRouter(prefix="/auth", tags=["auth"])
@router.post("/signup")
def signup(data: SignUpRequest):
    try:
        user = firebase_auth.create_user(
            email=data.email,
            password=data.password
        )
        return {"uid": user.uid, "email": user.email}
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

@router.post("/signin")
def signin(data: SignInRequest):
    # Firebase Admin SDK does not support password sign-in, use Firebase REST API
    api_key = os.getenv("FIREBASE_API_KEY")
    if not api_key:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Firebase API key not configured.")
    url = f"https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key={api_key}"
    payload = {
        "email": data.email,
        "password": data.password,
        "returnSecureToken": True
    }
    resp = requests.post(url, json=payload)
    if resp.status_code == 200:
        return resp.json()
    else:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=resp.json().get("error", {}).get("message", "Authentication failed"))
