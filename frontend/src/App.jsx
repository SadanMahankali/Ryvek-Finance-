import { useState, useEffect } from "react"
import axios from "axios"

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts"

const API = "http://127.0.0.1:8000/api"

const CATEGORIES = ["Food", "Transport", "Rent", "Shopping", "Entertainment", "Health", "Education", "Other"]

export default function App() {
  const [expenses, setExpenses] = useState([])
  const [amount, setAmount] = useState("")
  const [category, setCategory] = useState("Food")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchExpenses()
  }, [])

  const fetchExpenses = async () => {
    try {
      const res = await axios.get(`${API}/expenses`)
      setExpenses(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  const addExpense = async () => {
    if (!amount || !description) return
    setLoading(true)
    try {
      await axios.post(`${API}/expenses`, {
        amount: parseFloat(amount),
        category,
        description,
        date: new Date().toISOString().split("T")[0]
      })
      setAmount("")
      setDescription("")
      fetchExpenses()
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  const total = expenses.reduce((sum, e) => sum + parseFloat(e.amount), 0)

  const categoryTotals = expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + parseFloat(e.amount)
    return acc
  }, {})

  const chartData = Object.entries(categoryTotals).map(([name, value]) => ({ name, value: parseFloat(value.toFixed(2))}))

  const COLORS = ["#10B981", "#34D399", "#6EE7B7", "#059669", "#047857", "#065F46", "#A7F3D0", "#D1FAE5"]

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }} className="min-h-screen bg-gray-950 text-white">
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono&display=swap" rel="stylesheet" />

      {/* Header */}
      <div className="border-b border-gray-800 px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-0">
          <img src="/src/assets/logo.png" className="w-50 h-20 object-contain" alt="Ryvek logo" />
          <span className="font-semibold text-lg tracking-tight">Ryvek Finance</span>
        </div>
        <span className="text-gray-500 text-sm">Dashboard</span>
      </div>

      <div className="max-w-4xl mx-auto px-8 py-10">

        {/* Total Card */}
        <div className="bg-emerald-400 rounded-2xl p-8 mb-8 text-black">
          <p className="text-sm font-medium opacity-70 mb-1">Total Spent</p>
          <p style={{ fontFamily: "'DM Mono', monospace" }} className="text-5xl font-bold">£{total.toFixed(2)}</p>
          <p className="text-sm opacity-60 mt-2">{expenses.length} transactions</p>
        </div>

        {/* Add Expense Form */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-8">
          <h2 className="font-semibold mb-4 text-gray-200">Add Expense</h2>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <input
              className="bg-gray-800 border border-gray-700 rounded-xl p-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-400 col-span-2 sm:col-span-1"
              placeholder="Amount (£)"
              value={amount}
              onChange={e => setAmount(e.target.value)}
            />
            <select
              className="bg-gray-800 border border-gray-700 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-400"
              value={category}
              onChange={e => setCategory(e.target.value)}
            >
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <input
            className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-400 mb-3"
            placeholder="Description"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
          <button
            className="w-full bg-emerald-400 hover:bg-emerald-300 text-black font-semibold rounded-xl p-3 transition-colors"
            onClick={addExpense}
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Expense"}
          </button>
        </div>

        {/* Transactions List */}
        <div>
          {chartData.length > 0 && (
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-8">
              <h2 className="font-semibold mb-4 text-gray-200">Spending by Category</h2>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={110}
                    fpaddingAngle={3}
                    dataKey="value"
                    nameKey="name"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: "#111827", border: "1px solid #1F2937", borderRadius: "12px", color: "#fff"}}
                      formatter={(value, name) => [`£${value}`, name.charAt(0).toUpperCase() + name.slice(1)]}
                      labelFormatter={() => ""}
                      />
                  </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-3 mt-4">
                {chartData.map((entry,index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                    <span className="text-gray-400 text-sm">{entry.name.charAt(0).toUpperCase() + entry.name.slice(1)} · £{entry.value}</span>
                    </div>
                ))}
            </div>
            </div>
          )}
          <h2 className="font-semibold mb-4 text-gray-200">Recent Transactions</h2>
          <div className="flex flex-col gap-3">
            {expenses.length === 0 && (
              <p className="text-gray-600 text-sm">No expenses yet. Add one above.</p>
            )}
            {[...expenses].reverse().map(e => (
              <div key={e.id} className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-center justify-between hover:border-gray-700 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center text-lg">
                    {categoryEmoji(e.category)}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{e.description}</p>
                    <p className="text-gray-500 text-xs mt-0.5">{e.category} · {e.date}</p>
                  </div>
                </div>
                <p style={{ fontFamily: "'DM Mono', monospace" }} className="text-emerald-400 font-medium">£{parseFloat(e.amount).toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function categoryEmoji(category) {
  const map = {
    Food: "🍔", Transport: "🚗", Rent: "🏠", Shopping: "🛍️",
    Entertainment: "🎬", Health: "💊", Education: "📚", Other: "💸"
  }
  return map[category] || "💸"
}