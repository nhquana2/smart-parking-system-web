from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional
import paho.mqtt.client as mqtt
import json
from utils.auth import verify_token

# MQTT Configuration - can be changed as needed
MQTT_BROKER = "localhost"
MQTT_PORT = 1883
MQTT_KEEPALIVE = 60

router = APIRouter(prefix="/device-control", tags=["device-control"])

# Pydantic models for request bodies
class LCDMessage(BaseModel):
    line1: str
    line2: str

def publish_mqtt_message(topic: str, payload: dict):
    """Helper function to publish MQTT messages"""
    try:
        client = mqtt.Client()
        client.connect(MQTT_BROKER, MQTT_PORT, MQTT_KEEPALIVE)
        client.publish(topic, json.dumps(payload), retain=False)
        client.disconnect()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to send MQTT message: {str(e)}")

@router.post("/lcd/display")
def control_lcd(message: LCDMessage, user=Depends(verify_token)):
    """Send message to LCD 16x2 display"""
    payload = {
        "line1": message.line1,
        "line2": message.line2
    }
    publish_mqtt_message("smartparking/lcd/show", payload)
    return {"message": "LCD message sent successfully"}

@router.post("/buzzer/play")
def control_buzzer(user=Depends(verify_token)):
    """Play buzzer sound"""
    publish_mqtt_message("smartparking/buzzer/play", {})
    return {"message": "Buzzer activated successfully"}

@router.post("/servo/open")
def open_servo(user=Depends(verify_token)):
    """Open servo motor"""
    publish_mqtt_message("smartparking/servo/open", {})
    return {"message": "Servo opened successfully"}

@router.post("/servo/close")
def close_servo(user=Depends(verify_token)):
    """Close servo motor"""
    publish_mqtt_message("smartparking/servo/close", {})
    return {"message": "Servo closed successfully"}
