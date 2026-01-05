from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
import os

app = FastAPI()

# ვქმნით data ფოლდერს ბაზისთვის, თუ არ არსებობს
os.makedirs("data", exist_ok=True)

# ვეუბნებით, რომ static ფოლდერი გახადოს საჯარო (აქ იქნება index.html)
app.mount("/", StaticFiles(directory="app/static", html=True), name="static")

# API ტესტი
@app.get("/api/status")
def get_status():
    return {"status": "OnlyPings Systems Online", "ping": "Low"}