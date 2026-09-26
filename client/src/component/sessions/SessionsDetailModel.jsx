import { XIcon, UsersIcon, MessageSquareIcon } from 'lucide-react'
import React, { useState } from 'react'
import SessionsChatTab from './SessionsChatTab'
import SessionsParticipantsTab from './SessionsParticipantsTab'

const SessionsDetailModal = ({ session, onClose }) => {
  const [activeTab, setActiveTab] = useState('participants')

  if (!session) return null

  // Safe case-insensitive status check
  const isEnded = session.status?.toLowerCase() === "ended"

  return (
    <div className='fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4'>
      <div className='bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in duration-150'>

        {/* Modal Header */}
        <div className='p-6 border-b border-slate-100 flex items-center justify-between'>
          <div>
            <div className='flex items-center gap-2'>
              <span className='text-xs font-mono text-slate-500 font-medium bg-slate-100 px-2 py-0.5 rounded-md'>
                ID: {session.meetingId}
              </span>         
              <span className={`text-xs font-semibold rounded-full px-2 py-0.5 ${
                isEnded ? "text-slate-600 bg-slate-100" : "bg-emerald-50 text-emerald-700"
              }`}>
                {isEnded ? "Ended" : "Active"}
              </span>
            </div>
            
            <h2 className='font-medium text-2xl text-slate-900 mt-1'>
              {session.title || "Meeting Details"}
            </h2>
            
            <p className='text-xs text-slate-400 mt-1'> 
              Host: {session.host?.name || session.host || "Host"} · Created {new Date(session.createdAt).toLocaleString()}
            </p>
          </div>

          <button 
            onClick={onClose}
            className='p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer' 
            aria-label='Close Sessions Details'
          >
            <XIcon className='w-5 h-5'/>
          </button>
        </div>

        {/* Tabs Bar */}
        <div className='flex border-b border-slate-100 px-6 bg-slate-50/50'>
          <button
            onClick={() => setActiveTab('participants')}
            className={`flex items-center gap-2 py-3 px-4 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'participants'
                ? 'border-primary text-primary'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <UsersIcon size={15} />
            Participants ({session.participants?.length || 0})
          </button>

          <button
            onClick={() => setActiveTab('messages')}
            className={`flex items-center gap-2 py-3 px-4 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'messages'
                ? 'border-primary text-primary'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <MessageSquareIcon size={15} />
            Chat Transcript ({session.messages?.length || 0})
          </button>
        </div>

        {/* Tab Content Body */}
        <div className='flex-1 p-6 overflow-y-auto min-h-75'>
          {/* Fixed activeTab state comparison from 'chat' to 'messages' */}
          {activeTab === 'messages' ? (
            <SessionsChatTab messages={session.messages} />
          ) : (
            <SessionsParticipantsTab participants={session.participants} host={session.host}/>
          )}
        </div>

      </div>
    </div>
  )
}

export default SessionsDetailModal