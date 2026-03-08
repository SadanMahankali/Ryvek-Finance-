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

@router.get("/expenses")
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

@router.delete("/expenses/{expense_id}")
def delete_expense(expense_id: str):
    response = supabase.table("expense").delete().eq("id", expense_id).execute()
    return response.data