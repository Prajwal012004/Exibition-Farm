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
            "nameEn": "Organic Farming Experience",
            "nameMr": "सेंद्रिय शेतीचा अनुभव",
            "metaEn": "2 hours • ₹500 per person",
            "metaMr": "२ तास • प्रति व्यक्ती ₹५००",
            "priceInRupees": 500
        },
        {
            "id": 2,
            "nameEn": "Farm Visit",
            "nameMr": "शेतीला भेट",
            "metaEn": "1.5 hours • ₹300 per person",
            "metaMr": "दीड तास • प्रति व्यक्ती ₹३००",
            "priceInRupees": 300
        },
        {
            "id": 3,
            "nameEn": "Soil & Compost Workshop",
            "nameMr": "माती आणि कंपोस्ट कार्यशाळा",
            "metaEn": "2 hours • ₹400 per person",
            "metaMr": "२ तास • प्रति व्यक्ती ₹४००",
            "priceInRupees": 400
        }
    ]

