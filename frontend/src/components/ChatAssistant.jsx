import React, { useState, useRef, useEffect } from 'react'
import { Bot, Send, X, RefreshCw, Cpu, User } from 'lucide-react'
import { sendChatMessage } from '../api/client'
import toast from 'react-hot-toast'

const QUICK_QUERIES = [
  "What is the current condition of Modhera?",
  "Where is visitor congestion highest?",
  "Generate a conservation report",
  "Give me a 30-minute heritage route",
  "Explain today's alerts",
  "Tell me the history of Sidi Saiyyed Mosque",
  "Which sites need immediate attention?",
]

function ChatMessage({ role, content, loading }) {
  const isUser = role === 'user'
  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      <div className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs ${
        isUser ? 'bg-slate-700' : 'bg-purple-800'
      }`}>
        {isUser ? <User size={13} /> : <Bot size={13} />}
      </div>
      <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
        isUser
          ? 'bg-heritage-700/80 text-white rounded-tr-sm'
          : 'bg-slate-800 border border-slate-700 text-slate-200 rounded-tl-sm'
      }`}>
        {loading ? (
          <div className="flex items-center gap-2 text-slate-400">
            <div className="flex gap-1">
              {[0, 1, 2].map(i => (
                <div key={i} className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
            <span className="text-xs">Granite is thinking...</span>
          </div>
        ) : (
          <div className="whitespace-pre-line">{content}</div>
        )}
      </div>
    </div>
  )
}

export default function ChatAssistant({ onClose }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hello! I'm HeritageGuardian AI, your intelligent heritage conservation assistant powered by IBM Granite.\n\nI can help you with:\n• Site condition reports\n• Visitor flow analysis\n• Heritage stories\n• Conservation recommendations\n• Agent activity summaries\n\nWhat would you like to know?"
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [siteContext, setSiteContext] = useState('Modhera Sun Temple')
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = async (query) => {
    const q = query || input.trim()
    if (!q || loading) return
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: q }])
    setLoading(true)
    setMessages(prev => [...prev, { role: 'assistant', content: '', loading: true }])

    try {
      const res = await sendChatMessage(q, siteContext)
      setMessages(prev => {
        const updated = [...prev]
        updated[updated.length - 1] = { role: 'assistant', content: res.data.response }
        return updated
      })
    } catch {
      setMessages(prev => {
        const updated = [...prev]
        updated[updated.length - 1] = {
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please check the backend connection and try again.'
        }
        return updated
      })
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
  }

  return (
    <div className="w-96 flex flex-col h-full bg-slate-900 border-l border-slate-800 flex-shrink-0">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-purple-800 flex items-center justify-center">
            <Bot size={14} className="text-purple-200" />
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-100">HeritageGuardian AI</div>
            <div className="text-xs text-purple-400 flex items-center gap-1">
              <Cpu size={10} /> IBM Granite powered
            </div>
          </div>
        </div>
        <button onClick={onClose} className="text-slate-500 hover:text-slate-300 transition-colors">
          <X size={18} />
        </button>
      </div>

      {/* Context selector */}
      <div className="px-4 py-2 border-b border-slate-800/50">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span>Context:</span>
          <select
            value={siteContext}
            onChange={e => setSiteContext(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded px-2 py-0.5 text-slate-300 text-xs flex-1"
          >
            <option>Modhera Sun Temple</option>
            <option>Ahmedabad Walled City</option>
            <option>Sidi Saiyyed Mosque</option>
          </select>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <ChatMessage key={idx} {...msg} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick queries */}
      <div className="px-3 py-2 border-t border-slate-800/50">
        <div className="text-xs text-slate-600 mb-2">Quick queries:</div>
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {QUICK_QUERIES.slice(0, 4).map((q) => (
            <button
              key={q}
              onClick={() => send(q)}
              disabled={loading}
              className="flex-shrink-0 text-xs bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 px-2.5 py-1.5 rounded-lg transition-colors"
            >
              {q.length > 30 ? q.slice(0, 28) + '...' : q}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="p-4 border-t border-slate-800">
        <div className="flex gap-2 items-end">
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about heritage sites, alerts, routes..."
            rows={2}
            className="flex-1 bg-slate-800 border border-slate-700 text-slate-100 placeholder-slate-500 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-purple-600 resize-none"
          />
          <button
            onClick={() => send()}
            disabled={loading || !input.trim()}
            className="w-9 h-9 rounded-xl bg-purple-700 hover:bg-purple-600 disabled:opacity-40 flex items-center justify-center transition-colors flex-shrink-0"
          >
            {loading ? <RefreshCw size={14} className="text-white animate-spin" /> : <Send size={14} className="text-white" />}
          </button>
        </div>
        <div className="text-xs text-slate-600 mt-1.5 text-center">
          Powered by IBM Granite · Demo mode active
        </div>
      </div>
    </div>
  )
}
