import { useState } from "react"

const navItems = [
  { id: "home", label: "Home", emoji: "🏠" },
  { id: "transactions", label: "Transactions", emoji: "💳" },
  { id: "budget", label: "Budget", emoji: "🎯" },
  { id: "health", label: "Health Score", emoji: "📊" },
  { id: "chat", label: "AI Chat", emoji: "🤖" },
  { id: "learn", label: "Ryvek Learn", emoji: "🎮" },
  { id: "settings", label: "Settings", emoji: "⚙️" },
]

export default function Sidebar({ activePage, setActivePage }) {
  return (
    <div className="w-64 min-h-screen bg-gray-900 border-r border-gray-800 flex flex-col">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-gray-800 flex items-center gap-3">
        <img src="/src/assets/logo.png" className="w-10 h-10 object-contain" alt="Ryvek logo" />
        <div>
          <p className="font-bold text-white tracking-tight">Ryvek</p>
          <p className="text-emerald-400 text-xs font-medium">Finance</p>
        </div>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActivePage(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors ${
              activePage === item.id
                ? "bg-emerald-400 text-black font-semibold"
                : "text-gray-400 hover:bg-gray-800 hover:text-white"
            }`}
          >
            <span>{item.emoji}</span>
            <span className="text-sm">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Bottom */}
      <div className="px-6 py-4 border-t border-gray-800">
        <p className="text-gray-600 text-xs">Ryvek Finance v0.1</p>
      </div>
    </div>
  )
}