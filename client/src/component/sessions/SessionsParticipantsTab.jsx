import { CrownIcon, UserIcon } from 'lucide-react'
import React from 'react'

const SessionsParticipantsTab = ({ participants = [], host }) => {

  // Empty state when no participants exist
  if (participants.length === 0) {
    return (
      <div className='h-full text-sm py-12 flex flex-col items-center justify-center text-slate-400'>
        <UserIcon className='w-8 h-8 mb-2 text-slate-300' />
        <p>No participant logs recorded.</p>
      </div>
    )
  }

  // Safe host ID extraction
  const hostId = host?.id || host?._id || host

  return (
    <div className='space-y-2.5'>
      {/* Added .map array iteration */}
      {participants.map((p, idx) => {
        const participantUserId = p.user?.id || p.user?._id || p.user || p.id
        const isHost = Boolean(
          hostId && 
          participantUserId && 
          participantUserId.toString() === hostId.toString()
        )

        const name = p.name || p.user?.name || 'Anonymous'
        const email = p.email || p.user?.email

        return (
          <div 
            key={p.id || idx} 
            className='flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100'
          >
            {/* User Info & Avatar */}
            <div className='flex items-center gap-3'>
              {/* Corrected CSS class typo (text-primary) */}
              <div className='w-9 h-9 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-700 font-bold flex items-center justify-center text-sm'>
                {name ? name.charAt(0).toUpperCase() : '?'}
              </div>

              <div>
                <span className='text-sm font-semibold text-slate-800 flex items-center gap-1.5'>
                  {name}
                  {isHost && <CrownIcon className='w-3.5 h-3.5 text-amber-500' title="Host" />}
                </span>
                {email && <span className='text-xs text-slate-400 block'>{email}</span>}
              </div>
            </div>

            {/* Joined Timestamp */}
            <span className='text-xs text-slate-400 font-medium'>
              {p.joinedAt ? (
                `Joined: ${new Date(p.joinedAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit"
                })}`
              ) : ''}
            </span>
          </div>
        )
      })}
    </div>
  )
}

export default SessionsParticipantsTab