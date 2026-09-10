from fastapi import FastAPI

app = FastAPI()


@app.get("/api/health")
def health_check():
    return {
        "status": "ok",
        "message": "Farm backend is running"
    }


@app.get("/api/sessions")
def get_sessions():
    return [
        {
            "id": 1,
            "name": "Organic Farming Experience",
            "description": "Learn how crops are grown using natural farming methods.",
            "duration": "2 hours",
            "price": 500
        },
        {
            "id": 2,
            "name": "Farm Visit",
            "description": "Explore the farm and understand day-to-day farming activities.",
            "duration": "1.5 hours",
            "price": 300
        },
        {
            "id": 3,
            "name": "Soil & Compost Workshop",
            "description": "Learn about soil health and basic composting techniques.",
            "duration": "2 hours",
            "price": 400
        }
    ]

