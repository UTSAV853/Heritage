import React from 'react'
import {
  Bell, Check, Trash2, ExternalLink, AlertTriangle,
  FileText, Globe, Edit3, ShieldAlert, CheckCircle2
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function NotificationsDropdown({
  notifications = [],
  onMarkAllAsRead,
  onClearAll,
  onNotificationClick,
  onClose
}) {
  const navigate = useNavigate()

  const getTypeIcon = (type, severity) => {
    switch (type) {
      case 'ALERT':
        return severity === 'Critical' || severity === 'High' ? (
          <div className="w-8 h-8 rounded-full bg-red-950/80 border border-red-800 flex items-center justify-center text-red-400 flex-shrink-0">
            <ShieldAlert size={15} />
          </div>
        ) : (
          <div className="w-8 h-8 rounded-full bg-orange-950/80 border border-orange-800 flex items-center justify-center text-orange-400 flex-shrink-0">
            <AlertTriangle size={15} />
          </div>
        )
      case 'REPORT':
        return (
          <div className="w-8 h-8 rounded-full bg-blue-950/80 border border-blue-800 flex items-center justify-center text-blue-400 flex-shrink-0">
            <FileText size={15} />
          </div>
        )
      case 'SYSTEM':
        return (
          <div className="w-8 h-8 rounded-full bg-emerald-950/80 border border-emerald-800 flex items-center justify-center text-emerald-400 flex-shrink-0">
            <Globe size={15} />
          </div>
        )
      case 'MANUAL_ENTRY':
        return (
          <div className="w-8 h-8 rounded-full bg-purple-950/80 border border-purple-800 flex items-center justify-center text-purple-400 flex-shrink-0">
            <Edit3 size={15} />
          </div>
        )
      default:
        return (
          <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 flex-shrink-0">
            <Bell size={15} />
          </div>
        )
    }
  }

  const handleItemClick = (notif) => {
    if (onNotificationClick) {
      onNotificationClick(notif.id)
    }
    if (notif.link) {
      navigate(notif.link)
      if (onClose) onClose()
    }
  }

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <div
      className="absolute right-0 mt-3 w-96 max-w-[calc(100vw-2rem)] bg-slate-900 border border-slate-700/90 rounded-xl shadow-2xl z-50 overflow-hidden slide-in backdrop-blur-xl"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="px-4 py-3 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm text-white flex items-center gap-1.5">
            <Bell size={14} className="text-heritage-400" />
            Notifications
          </span>
          {unreadCount > 0 && (
            <span className="badge badge-orange text-[10px] px-1.5 py-0.2">
              {unreadCount} new
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 text-xs">
          {unreadCount > 0 && (
            <button
              onClick={onMarkAllAsRead}
              className="text-slate-400 hover:text-heritage-300 font-medium transition-colors flex items-center gap-1"
              title="Mark all as read"
            >
              <Check size={12} /> Mark all read
            </button>
          )}
          {notifications.length > 0 && (
            <button
              onClick={onClearAll}
              className="text-slate-500 hover:text-red-400 font-medium transition-colors flex items-center gap-1"
              title="Clear all notifications"
            >
              <Trash2 size={12} /> Clear
            </button>
          )}
        </div>
      </div>

      {/* Notification List */}
      <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-800/60">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs space-y-2">
            <CheckCircle2 size={24} className="mx-auto text-slate-600" />
            <p>You're all caught up!</p>
            <p className="text-[11px] text-slate-500">No active alerts or pending system events.</p>
          </div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => handleItemClick(notif)}
              className={`p-3.5 flex items-start gap-3 hover:bg-slate-800/50 cursor-pointer transition-colors text-left relative ${
                !notif.read ? 'bg-slate-800/25' : ''
              }`}
            >
              {getTypeIcon(notif.type, notif.severity)}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1 mb-0.5">
                  <div className="text-xs font-semibold text-white truncate">
                    {notif.title}
                  </div>
                  <span className="text-[10px] text-slate-500 whitespace-nowrap">
                    {notif.timeAgo}
                  </span>
                </div>
                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                  {notif.message}
                </p>
                {notif.site && (
                  <div className="text-[11px] text-heritage-400 mt-1 flex items-center gap-1 font-medium">
                    <span>📍 {notif.site}</span>
                  </div>
                )}
              </div>
              {!notif.read && (
                <div className="w-2 h-2 rounded-full bg-heritage-500 flex-shrink-0 mt-1.5" />
              )}
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-2.5 bg-slate-950/60 border-t border-slate-800/80 text-center">
        <button
          onClick={() => {
            navigate('/insights')
            if (onClose) onClose()
          }}
          className="text-xs text-heritage-400 hover:text-heritage-300 font-medium inline-flex items-center gap-1"
        >
          View All Active Alerts & Insights <ExternalLink size={11} />
        </button>
      </div>
    </div>
  )
}
