from fastapi import FastAPI, Depends, Request
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from pydantic import BaseModel
import os
import httpx
import datetime

from app.database import init_db, SessionLocal, Package

# --- DB & SEEDING LOGIC (იგივე რაც გქონდა) ---
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def populate_default_packages(db: Session):
    if db.query(Package).first():
        return
    
    print("Writing new OnlyPings packages structure...")
    packages = [
        Package(name="Soldier", game_type="cs2", price=0.0, description="Start your training. Public slots only.", cpu_limit=100, ram_limit=2048, disk_limit=15000),
        Package(name="General", game_type="cs2", price=30.0, description="Rank up. Priority queue + Skins access.", cpu_limit=200, ram_limit=4096, disk_limit=25000),
        Package(name="King", game_type="cs2", price=60.0, description="Total domination. Max resources.", cpu_limit=400, ram_limit=8192, disk_limit=50000),
        Package(name="Steve", game_type="minecraft", price=0.0, description="Basic Vanilla Survival.", cpu_limit=100, ram_limit=2048, disk_limit=10000),
        Package(name="Phantom", game_type="minecraft", price=20.0, description="Flying high. Good for small plugins.", cpu_limit=200, ram_limit=4096, disk_limit=20000),
        Package(name="Wither", game_type="minecraft", price=40.0, description="Destructive power. Modpack ready.", cpu_limit=300, ram_limit=6144, disk_limit=40000),
        Package(name="Herobrine", game_type="minecraft", price=70.0, description="A Legend. Unlimited Power.", cpu_limit=400, ram_limit=8192, disk_limit=60000),
    ]
    db.add_all(packages)
    db.commit()

init_db()
db = SessionLocal()
populate_default_packages(db)
db.close()

# --- FASTAPI APP ---
app = FastAPI()

# 1. PING SYSTEM (ახალი კოდი)
class PingData(BaseModel):
    ping: int

@app.head("/api/ping-target")
async def ping_target():
    return {} # სწრაფი პასუხი გასაზომად

@app.post("/api/log-ping")
async def log_ping(data: PingData, request: Request):
    user_ip = request.client.host
    ping_value = data.ping
    
    # ლოკაციის გაგება
    location = "Unknown"
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(f"http://ip-api.com/json/{user_ip}", timeout=1.0)
            geo = response.json()
            if geo.get("status") == "success":
                location = f"{geo['country']}, {geo['city']}"
    except:
        location = "Lookup Failed"

    log_entry = f"[{datetime.datetime.now()}] IP: {user_ip} | Loc: {location} | Ping: {ping_value}ms\n"
    
    # ფაილში ჩაწერა (ping_logs.txt)
    with open("ping_logs.txt", "a") as f:
        f.write(log_entry)

    return {"status": "saved"}

# 2. EXISTING APIs
@app.get("/api/packages")
def get_packages(db: Session = Depends(get_db)):
    return db.query(Package).filter(Package.is_visible == True).all()

@app.get("/api/status")
def get_status():
    return {"status": "OnlyPings Systems Online", "ping": "Low"}

# Static Files (ბოლოში უნდა იყოს)
os.makedirs("app/static", exist_ok=True)
app.mount("/", StaticFiles(directory="app/static", html=True), name="static")