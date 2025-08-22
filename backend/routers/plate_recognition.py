from fastapi import APIRouter, File, UploadFile, HTTPException, Body
from fastapi.responses import FileResponse
from models.plate_recognition import OCRResponse
import numpy as np
import cv2
import os
from fast_alpr import ALPR

router = APIRouter(prefix="/plate", tags=["plate_recognition"])

# Create uploads directory if it doesn't exist
UPLOADS_DIR = "uploads"
os.makedirs(UPLOADS_DIR, exist_ok=True)
IMAGE_PATH = os.path.join(UPLOADS_DIR, "most_recent_image.jpg")

print("Initializing AI models...")
try:
    alpr = ALPR(
        detector_model="yolo-v9-t-384-license-plate-end2end",
        ocr_model="cct-xs-v1-global-model",
    )
except Exception as e:
    print(f"ERROR: Could not load ALPR model. Error details: {e}")
    alpr = None
print("All models are ready!")

@router.post("/recognize", response_model=OCRResponse, summary="Recognize License Plate from an Image")
async def recognize_license_plate(
    data: bytes = Body(..., media_type="image/jpeg")
):
    if alpr is None:
        raise HTTPException(status_code=503, detail="Service Unavailable: The ALPR model is not loaded.")
    try:
        img_bytes = data
        # Save raw image data to fixed path
        with open(IMAGE_PATH, "wb") as f:
            f.write(img_bytes)
        img_array = np.frombuffer(img_bytes, np.uint8)
        img_bgr = cv2.imdecode(img_array, cv2.IMREAD_COLOR)
        if img_bgr is None:
            raise ValueError("Could not decode the image file.")
        img_rgb = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2RGB)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Could not read or process the image file. Error: {e}")
    try:
        alpr_results = alpr.predict(img_rgb)
        plate_strings = [result.ocr.text for result in alpr_results if result.ocr.confidence > 0.8]
        print("ALPR Results:", alpr_results)
    except Exception as e:
        print(f"ERROR: An exception occurred during ALPR recognition: {e}")
        raise HTTPException(status_code=500, detail="An error occurred during the recognition process.")
    return OCRResponse(results=plate_strings)

@router.get("/recent-image", summary="Get the most recent processed image")
async def get_recent_image():
    if not os.path.exists(IMAGE_PATH):
        raise HTTPException(status_code=404, detail="No recent image found")
    
    response = FileResponse(
        path=IMAGE_PATH,
        media_type="image/jpeg",
        filename="most_recent_image.jpg"
    )

    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Pragma"] = "no-cache"
    response.headers["Expires"] = "0"

    return response
