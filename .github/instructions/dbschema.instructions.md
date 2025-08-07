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
```
