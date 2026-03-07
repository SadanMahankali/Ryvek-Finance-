from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import expenses



app = FastAPI(title="Ryvek Finance API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174", "http://localhost:5175"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(expenses.router, prefix="/api")

@app.get("/")
def root():
    return {"message": "Ryvek Finance API is running"}