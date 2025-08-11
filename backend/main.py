
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth, rfid, vehicle, fee_config
from routers import plate_recognition

app = FastAPI()

origins = [
    "*"
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(auth.router)
app.include_router(rfid.router)
app.include_router(vehicle.router)
app.include_router(fee_config.router)
app.include_router(plate_recognition.router)

@app.get("/")
def read_root():
    return {"message": "Smart Parking System Backend is running."}
