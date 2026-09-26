import { MessageSquareIcon } from 'lucide-react'
import React from 'react'

const SessionsChatTab = ({ messages = [] }) => {
  // 1. EMPTY STATE
  if (messages.length === 0) {
    return (
      <div className='h-full text-sm py-12 flex flex-col items-center justify-center text-slate-400'>
        <MessageSquareIcon className='w-8 h-8 mb-2 text-slate-300' />
        <p>No chat messages were recorded in this meeting session.</p>
      </div>
    )
  }

  // Helper to safely parse dates/timestamps without throwing errors
  const formatTime = (timeValue) => {
    if (!timeValue) return ''
    const date = new Date(timeValue)
    return isNaN(date.getTime())
      ? timeValue // Returns raw string if already formatted (e.g. "10:30 AM")
      : date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  // 2. MESSAGES LIST
  return (
    <div className='space-y-3'>
      {messages.map((msg, idx) => {
        // Safe extractions for property name variations
        const senderName = msg.SenderName || msg.senderName || msg.sender || 'Anonymous'
        const messageText = msg.text || msg.content || ''

        return (
          <div key={msg.id || idx} className='bg-slate-50 p-3.5 rounded-2xl border border-slate-100'>
            {/* Header: Sender Name & Timestamp */}
            <div className='flex items-center justify-between mb-1'>
              <span className='text-sm font-semibold text-slate-800'>{senderName}</span>
              <span className='text-[10px] text-slate-400'>
                {formatTime(msg.timestamp)}
              </span>
            </div>

            {/* Message Body */}
            <p className='text-sm text-slate-700 font-normal leading-relaxed'>{messageText}</p>
          </div>
        )
      })}
    </div>
  )
}

export default SessionsChatTab