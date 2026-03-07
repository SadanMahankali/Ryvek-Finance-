from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Ryvek Finance API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Ryvek Finance API is running"}