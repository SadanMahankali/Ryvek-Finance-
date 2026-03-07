from fastapi import APIRouter
from database import supabase
from pydantic import BaseModel
from datetime import date as date_type

router = APIRouter()

class Expense(BaseModel):
    amount: float
    category: str
    description: str
    date: date_type = date_type.today()

@router.post("/expenses")
def get_expenses():
    response = supabase.table("expense").select("*").execute()
    return response.data

@router.post("/expenses")
def add_expense(expense: Expense):
    response = supabase.table("expense").insert({
        "amount": expense.amount,
        "category": expense.category,
        "description": expense.description,
        "date": str(expense.date)
    }).execute()
    return response.data