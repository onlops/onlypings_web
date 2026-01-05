from fastapi import FastAPI, Depends
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
import os

from app.database import init_db, SessionLocal, Package

# ბაზის სესიის მიღება (Dependency)
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# საწყისი მონაცემების შევსება (Seeding)
def populate_default_packages(db: Session):
    # ვამოწმებთ, პაკეტები უკვე ხომ არ არსებობს
    if db.query(Package).first():
        return
    
    print("Writing new OnlyPings packages structure...")
    
    packages = [
        # --- CS2 PACKAGES (3 Tiers) ---
        Package(
            name="Soldier",
            game_type="cs2",
            price=0.0,  # უფასო
            description="Start your training. Public slots only.",
            cpu_limit=100, ram_limit=2048, disk_limit=15000
        ),
        Package(
            name="General",
            game_type="cs2",
            price=30.0, # ფასიანი 1
            description="Rank up. Priority queue + Skins access.",
            cpu_limit=200, ram_limit=4096, disk_limit=25000
        ),
        Package(
            name="King",
            game_type="cs2",
            price=60.0, # ფასიანი 2
            description="Total domination. Max resources.",
            cpu_limit=400, ram_limit=8192, disk_limit=50000
        ),
        
        # --- MINECRAFT PACKAGES (4 Tiers) ---
        Package(
            name="Steve", # სახელი "უფასო"-სთვის
            game_type="minecraft",
            price=0.0, # უფასო
            description="Basic Vanilla Survival.",
            cpu_limit=100, ram_limit=2048, disk_limit=10000
        ),
        Package(
            name="Phantom",
            game_type="minecraft",
            price=20.0,
            description="Flying high. Good for small plugins.",
            cpu_limit=200, ram_limit=4096, disk_limit=20000
        ),
        Package(
            name="Wither",
            game_type="minecraft",
            price=40.0,
            description="Destructive power. Modpack ready.",
            cpu_limit=300, ram_limit=6144, disk_limit=40000
        ),
        Package(
            name="Herobrine",
            game_type="minecraft",
            price=70.0,
            description="A Legend. Unlimited Power.",
            cpu_limit=400, ram_limit=8192, disk_limit=60000
        ),
    ]
    
    db.add_all(packages)
    db.commit()
    print("New packages added successfully!")

# ინიციალიზაცია
init_db()
# ვქმნით დროებით სესიას, რომ მონაცემები ჩავყაროთ
db = SessionLocal()
populate_default_packages(db)
db.close()

app = FastAPI()

# 1. API: პაკეტების წამოღება (ფრონტისთვის)
@app.get("/api/packages")
def get_packages(db: Session = Depends(get_db)):
    return db.query(Package).filter(Package.is_visible == True).all()

# 2. API: სისტემის სტატუსი
@app.get("/api/status")
def get_status():
    return {"status": "OnlyPings Systems Online", "ping": "Low"}

# ფრონტენდის (HTML) გაშვება
os.makedirs("app/static", exist_ok=True)
app.mount("/", StaticFiles(directory="app/static", html=True), name="static")