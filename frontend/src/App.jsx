import { useState, useEffect } from "react"
import axios from "axios"

const API = "http://127.0.0.1:8000/api"

export default function App() {
  const [expenses, setExpenses] = useState([])
  const [amount, setAmount] = useState("")
  const [category, setCategory] = useState("")
  const [description, setDescription] = useState("")

  useEffect(() => {
    fetchExpenses()
  }, [])

  const fetchExpenses = async () => {
    const res = await axios.get(`${API}/expenses`)
    setExpenses(res.data)
  }

  const addExpense = async () => {
    await axios.post(`${API}/expenses`, {
      amount: parseFloat(amount),
      category,
      description,
      date: new Date().toISOString().split("T")[0]
    })
    setAmount("")
    setCategory("")
    setDescription("")
    fetchExpenses()
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <h1 className="text-3xl font-bold mb-8">Ryvek Finance</h1>

      <div className="bg-gray-900 p-6 rounded-xl mb-8 flex flex-col gap-4 max-w-md">
        <input className="bg-gray-800 p-3 rounded-lg" placeholder="Amount" value={amount} onChange={e => setAmount(e.target.value)} />
        <input className="bg-gray-800 p-3 rounded-lg" placeholder="Category" value={category} onChange={e => setCategory(e.target.value)} />
        <input className="bg-gray-800 p-3 rounded-lg" placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
        <button className="bg-blue-600 hover:bg-blue-500 p-3 rounded-lg font-semibold" onClick={addExpense}>Add Expense</button>
      </div>

      <div className="flex flex-col gap-3 max-w-md">
        {expenses.map(e => (
          <div key={e.id} className="bg-gray-900 p-4 rounded-xl flex justify-between">
            <div>
              <p className="font-semibold">{e.description}</p>
              <p className="text-gray-400 text-sm">{e.category} · {e.date}</p>
            </div>
            <p className="text-green-400 font-bold">£{e.amount}</p>
          </div>
        ))}
      </div>
    </div>
  )
}