
from fastapi import FastAPI
from routers import auth, rfid, vehicle

app = FastAPI()
app.include_router(auth.router)
app.include_router(rfid.router)
app.include_router(vehicle.router)

@app.get("/")
def read_root():
    return {"message": "Smart Parking System Backend is running."}
