
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth, rfid, vehicle, fee_config, log, device_control, device_info, dashboard
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
app.include_router(log.router)
app.include_router(plate_recognition.router)
app.include_router(device_control.router)
app.include_router(device_info.router)
app.include_router(dashboard.router)

@app.get("/")
def read_root():
    return {"message": "Smart Parking System Backend is running."}
