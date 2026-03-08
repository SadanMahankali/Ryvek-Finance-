import { useState, useEffect } from "react"
import axios from "axios"
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts"
import Sidebar from "./Sidebar"

const API = "http://127.0.0.1:8000/api"
const CATEGORIES = ["Food", "Transport", "Rent", "Shopping", "Entertainment", "Health", "Education", "Other"]

export default function App() {
  const [activePage, setActivePage] = useState("home")
  const [expenses, setExpenses] = useState([])
  const [amount, setAmount] = useState("")
  const [category, setCategory] = useState("Food")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => { fetchExpenses() }, [])

  const fetchExpenses = async () => {
    try {
      const res = await axios.get(`${API}/expenses`)
      setExpenses(res.data)
    } catch (err) { console.error(err) }
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
    } catch (err) { console.error(err) }
    setLoading(false)
  }

  const deleteExpense = async (id) => {
    try {
      await axios.delete(`${API}/expenses/${id}`)
      fetchExpenses()
    } catch (err) { console.error(err) }
  }

  const total = expenses.reduce((sum, e) => sum + parseFloat(e.amount), 0)
  const categoryTotals = expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + parseFloat(e.amount)
    return acc
  }, {})
  const chartData = Object.entries(categoryTotals).map(([name, value]) => ({ name, value: parseFloat(value.toFixed(2)) }))
  const COLORS = ["#10B981", "#34D399", "#6EE7B7", "#059669", "#047857", "#065F46", "#A7F3D0", "#D1FAE5"]

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }} className="flex min-h-screen bg-gray-950 text-white">
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono&display=swap" rel="stylesheet" />
      
      <Sidebar activePage={activePage} setActivePage={setActivePage} />

      <div className="flex-1 overflow-auto">
        {activePage === "home" && <HomePage expenses={expenses} total={total} chartData={chartData} COLORS={COLORS} />}
        {activePage === "transactions" && (
          <TransactionsPage
            expenses={expenses}
            amount={amount} setAmount={setAmount}
            category={category} setCategory={setCategory}
            description={description} setDescription={setDescription}
            loading={loading}
            addExpense={addExpense}
            deleteExpense={deleteExpense}
            CATEGORIES={CATEGORIES}
            chartData={chartData}
            COLORS={COLORS}
          />
        )}
        {activePage === "budget" && <PlaceholderPage title="Budget" emoji="🎯" />}
        {activePage === "health" && <PlaceholderPage title="Health Score" emoji="📊" />}
        {activePage === "chat" && <PlaceholderPage title="AI Chat" emoji="🤖" />}
        {activePage === "learn" && <PlaceholderPage title="Ryvek Learn" emoji="🎮" />}
        {activePage === "settings" && <PlaceholderPage title="Settings" emoji="⚙️" />}
      </div>
    </div>
  )
}

function HomePage({ expenses, total, chartData, COLORS }) {
  const recentExpenses = [...expenses].reverse().slice(0, 5)
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-8">Good morning 👋</h1>
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-emerald-400 rounded-2xl p-6 text-black col-span-2">
          <p className="text-sm font-medium opacity-70 mb-1">Total Spent</p>
          <p style={{ fontFamily: "'DM Mono', monospace" }} className="text-5xl font-bold">£{total.toFixed(2)}</p>
          <p className="text-sm opacity-60 mt-2">{expenses.length} transactions</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <p className="text-sm text-gray-400 mb-1">Categories</p>
          <p className="text-3xl font-bold">{chartData.length}</p>
          <p className="text-gray-500 text-sm mt-2">active</p>
        </div>
      </div>

      {chartData.length > 0 && (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-8">
          <h2 className="font-semibold mb-4">Spending Breakdown</h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={chartData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={3} dataKey="value" nameKey="name">
                {chartData.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: "#111827", border: "1px solid #1F2937", borderRadius: "12px", color: "#fff" }} formatter={(value, name) => [`£${value}`, name.charAt(0).toUpperCase() + name.slice(1)]} labelFormatter={() => ""} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <h2 className="font-semibold mb-4">Recent Transactions</h2>
        <div className="flex flex-col gap-3">
          {recentExpenses.length === 0 && <p className="text-gray-600 text-sm">No transactions yet.</p>}
          {recentExpenses.map(e => (
            <div key={e.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-gray-800 flex items-center justify-center">{categoryEmoji(e.category)}</div>
                <div>
                  <p className="text-sm font-medium">{e.description}</p>
                  <p className="text-xs text-gray-500">{e.category} · {e.date}</p>
                </div>
              </div>
              <p style={{ fontFamily: "'DM Mono', monospace" }} className="text-emerald-400 text-sm">£{parseFloat(e.amount).toFixed(2)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function TransactionsPage({ expenses, amount, setAmount, category, setCategory, description, setDescription, loading, addExpense, deleteExpense, CATEGORIES, chartData, COLORS }) {
  return (
    <div className="p-8 max-w-3xl">
      <h1 className="text-2xl font-bold mb-8">Transactions</h1>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-8">
        <h2 className="font-semibold mb-4 text-gray-200">Add Expense</h2>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <input className="bg-gray-800 border border-gray-700 rounded-xl p-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-400" placeholder="Amount (£)" value={amount} onChange={e => setAmount(e.target.value)} />
          <select className="bg-gray-800 border border-gray-700 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-400" value={category} onChange={e => setCategory(e.target.value)}>
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <input className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-400 mb-3" placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
        <button className="w-full bg-emerald-400 hover:bg-emerald-300 text-black font-semibold rounded-xl p-3 transition-colors" onClick={addExpense} disabled={loading}>
          {loading ? "Adding..." : "Add Expense"}
        </button>
      </div>

      {chartData.length > 0 && (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-8">
          <h2 className="font-semibold mb-4 text-gray-200">Spending by Category</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={chartData} cx="50%" cy="50%" innerRadius={70} outerRadius={110} paddingAngle={3} dataKey="value" nameKey="name">
                {chartData.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: "#111827", border: "1px solid #1F2937", borderRadius: "12px", color: "#fff" }} formatter={(value, name) => [`£${value}`, name.charAt(0).toUpperCase() + name.slice(1)]} labelFormatter={() => ""} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-3 mt-4">
            {chartData.map((entry, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                <span className="text-gray-400 text-sm">{entry.name.charAt(0).toUpperCase() + entry.name.slice(1)} · £{entry.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <h2 className="font-semibold mb-4 text-gray-200">All Transactions</h2>
        <div className="flex flex-col gap-3">
          {expenses.length === 0 && <p className="text-gray-600 text-sm">No expenses yet.</p>}
          {[...expenses].reverse().map(e => (
            <div key={e.id} className="bg-gray-800 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-gray-700 flex items-center justify-center text-lg">{categoryEmoji(e.category)}</div>
                <div>
                  <p className="font-medium text-sm">{e.description}</p>
                  <p className="text-gray-500 text-xs mt-0.5">{e.category} · {e.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <p style={{ fontFamily: "'DM Mono', monospace" }} className="text-emerald-400 font-medium">£{parseFloat(e.amount).toFixed(2)}</p>
                <button onClick={() => deleteExpense(e.id)} className="text-gray-600 hover:text-red-400 transition-colors text-lg">✕</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function PlaceholderPage({ title, emoji }) {
  return (
    <div className="p-8 flex flex-col items-center justify-center min-h-screen">
      <p className="text-6xl mb-4">{emoji}</p>
      <h1 className="text-2xl font-bold mb-2">{title}</h1>
      <p className="text-gray-500">Coming soon</p>
    </div>
  )
}

function categoryEmoji(category) {
  const map = { Food: "🍔", Transport: "🚗", Rent: "🏠", Shopping: "🛍️", Entertainment: "🎬", Health: "💊", Education: "📚", Other: "💸" }
  return map[category] || "💸"
}