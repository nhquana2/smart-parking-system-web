---
applyTo: "**"
---

# Copilot DB Schema Instructions

## Firestore RFID Collection

-   Collection name: `rfid`
-   Document fields:
    -   `uid`: string (document ID, e.g. "1BEFD07A")
    -   `balance`: number (e.g. 0)
    -   `dateAdded`: timestamp (e.g. 2025-07-31T16:13:05Z)
    -   `status`: string ("active" or "inactive")
-   Document ID should match `uid`.
-   All endpoints should use this schema for RFID operations.
-   `dateAdded` must be a Firestore timestamp.

## Example

{ "uid": "1BEFD07A", "balance": 0, "dateAdded": <timestamp>, "status": "active" }

```

## Firestore Vehicles Collection

-   Collection name: `vehicles`
-   Document fields:
    -   `licensePlate`: string (e.g. "50A00001")
    -   `rfidUID`: string (e.g. "1BEFD07A")
    -   `status`: string ("exit" or "parking")
    -   `timeIn`: timestamp (e.g. 2025-07-30T07:34:20Z)
    -   `timeOut`: timestamp (optional, only present if status is "exit")
    -   `fee`: number (optional, only present if status is "exit", e.g. 10000)
-   Document ID is auto-generated.
    -   Vehicles can be deleted regardless of status. "exit" status is for log/traceback.
-   `rfidUID` cannot be changed via update API.
-   `fee` field only applies to vehicles with status "exit".
-   All endpoints should use this schema for vehicles operations.

## Firestore Fee Configuration Collection

-   Collection name: `feeConfig`
-   Document fields:
    -   `pricePerHour`: number (e.g. 5000 - price per hour in VND)
    -   `multiplier`: number (e.g. 1.5 - multiplier for additional hours)
    -   `maximumPrice`: number (e.g. 50000 - maximum price per day in VND)
    -   `additionalCharge`: number (e.g. 2000 - additional charge for services in VND)
-   Document ID: "defaultFee" (fixed document ID)
-   All endpoints should use this schema for fee configuration operations.

## Example

{ "pricePerHour": 5000, "multiplier": 1.5, "maximumPrice": 50000, "additionalCharge": 2000 }

## Firestore Logs Collection

-   Collection name: `logs`
-   Document fields:
    -   `type`: string ("vehicle_in", "vehicle_out", or "device")
    -   `message`: string (log message description)
    -   `dateLogged`: timestamp (e.g. 2025-08-11T10:30:00Z)
-   Document ID is auto-generated.
-   All endpoints should use this schema for logs operations.
-   `dateLogged` must be a Firestore timestamp.

## Example

{ "type": "vehicle_in", "message": "Vehicle with license plate 50A00001 entered the parking", "dateLogged": <timestamp> }

```
