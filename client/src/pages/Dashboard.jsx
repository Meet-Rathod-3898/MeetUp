import { ArrowRightIcon, KeyboardIcon, PlusIcon, ShieldCheckIcon } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth, useUser } from '@clerk/react'
import api from '../config/api.js'

const Dashboard = () => {
  const { user, isLoaded: isUserLoaded } = useUser()
  const { isLoaded: isAuthLoaded, isSignedIn, getToken } = useAuth()
  const navigate = useNavigate()

  const [isCreating, setIsCreating] = useState(false)
  const [correctTime, setCorrectTime] = useState(new Date())
  const [stats, setStats] = useState(null)
  const [joinId, setJoinId] = useState('')

  // Live Clock Effect
  useEffect(() => {
    const timer = setInterval(() => setCorrectTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  // Fetch Stats Effect
  useEffect(() => {
    const fetchStats = async () => {
      if (!isAuthLoaded || !isSignedIn) return
      try {
        const token = await getToken()
        const { data } = await api.get('/api/meetings/stats', {
          headers: { Authorization: `Bearer ${token}` }
        })
        setStats(data)
      } catch (error) {
        toast.error(error.response?.data?.error || error.message)
      }
    }
    fetchStats()
  }, [isAuthLoaded, isSignedIn, getToken])

  // Handle Create Meeting
  const handleCreateMeeting = async () => {
    if (!isAuthLoaded || !isSignedIn) return
    setIsCreating(true)

    try {
      const token = await getToken()
      const userName = user?.fullName || 'User'
      const res = await api.post(
        '/api/meetings',
        { title: `${userName}'s Meeting` },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      const meetingId = res.data.meeting.meetingId
      toast.success('Meeting Created!')
      navigate(`/meeting/${meetingId}`)
    } catch (error) {
      toast.error(error.response?.data?.error || error.message)
    } finally {
      setIsCreating(false)
    }
  }

  // Handle Join Meeting
  const handleJoinMeeting = async (e) => {
    e.preventDefault()
    const cleanId = joinId.trim().toLowerCase()

    if (!/^[a-z]{3}(?:-[a-z]{3}){2}$/.test(cleanId)) {
      toast.error('Please enter a valid Meeting ID (e.g., abc-def-ghi)')
      return
    }

    try {
      const token = await getToken()
      await api.get(`/api/meetings/${cleanId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      navigate(`/meeting/${cleanId}`)
    } catch (error) {
      toast.error('Meeting not found. Check the ID and try again.')
    }
  }

  // Safe User Data Fallbacks
  const userName = user?.fullName || 'User'
  const userEmail = user?.primaryEmailAddress?.emailAddress || ''

  if (!isUserLoaded || !isAuthLoaded) {
    return (
      <div className='flex-1 flex items-center justify-center min-h-[60vh]'>
        <div className='w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin'></div>
      </div>
    )
  }

  return (
    <div className='flex-1 max-w-7xl w-full mx-auto p-6 md:p-12 flex flex-col justify-center'>
      <div className='grid grid-cols-1 lg:grid-cols-12 gap-12 items-center'>
        
        {/* Left Column - Actions */}
        <div className='lg:col-span-7 space-y-8'>
          <div className='space-y-3'>
            <div className='inline-flex items-center gap-2 px-3.5 pr-6 py-2 rounded-full bg-white/25 text-xs font-medium'>
              <ShieldCheckIcon size={16} />
              Secure Peer-to-Peer Encryption
            </div>
            <h1 className='text-4xl sm:text-5xl text-slate-800 leading-tight font-medium'>
              High Quality Video Calls. <br />
              <span className='text-primary'>Built For Everyone.</span>
            </h1>
            <p className='text-slate-700 text-base sm:text-lg max-w-xl leading-relaxed'>
              Connect, collaborate, and celebrate from anywhere with ultra-low latency video, screen sharing, and real-time chat.
            </p>

            <div className='flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2'>
              <button
                type='button'
                onClick={handleCreateMeeting}
                disabled={isCreating}
                className='bg-primary hover:bg-primary-hover text-white font-medium px-6 py-3.5 rounded-full shadow-md shadow-primary/20 flex items-center justify-center gap-2.5 transition-all cursor-pointer disabled:opacity-50'
              >
                <PlusIcon className='h-5 w-5' />
                <span>{isCreating ? 'Creating...' : 'New Meeting'}</span>
              </button>

              <form onSubmit={handleJoinMeeting} className='flex-1 flex items-center gap-2'>
                <div className='relative flex-1'>
                  <KeyboardIcon className='w-5 h-5 text-primary/90 absolute left-4 top-1/2 -translate-y-1/2' />
                  <input
                    type='text'
                    placeholder='Enter Meeting Code (e.g. abc-def-ghi)'
                    value={joinId}
                    onChange={(e) => setJoinId(e.target.value)}
                    className='w-full bg-white/75 border border-primary-border/80 focus:border-primary/60 focus:ring-1 focus:ring-primary/60 rounded-full pl-12 pr-4 py-3.5 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all'
                  />
                </div>
                <button
                  type='submit'
                  disabled={!joinId.trim()}
                  className='bg-slate-900 hover:bg-slate-800 disabled:opacity-40 disabled:hover:bg-slate-900 text-white font-medium px-6 py-3.5 rounded-full transition-all flex items-center justify-center cursor-pointer shadow-xs'
                >
                  <span>Join</span>
                  <ArrowRightIcon className='w-4 h-4 ml-1.5' />
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Right Column - Hero Graphic & Clock Card */}
        <div className='lg:col-span-5 flex flex-col items-center justify-center space-y-4'>
          <div className='w-full bg-white/75 backdrop-blur rounded-4xl p-8 border border-slate-200 text-center space-y-6 relative overflow-hidden'>
            <div className='space-y-1'>
              <p className='mb-5 text-xl text-left'>
                Hi, <span className='font-medium'>{userName}</span>
              </p>
              <h2 className='text-4xl xl:text-7xl my-4 text-slate-900 tracking-wide'>
                {correctTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }).toUpperCase()}
              </h2>
              <p className='font-medium tracking-wide text-primary'>
                {correctTime.toLocaleDateString(undefined, {
                  weekday: 'long',
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </p>
            </div>

            <div className='pt-4 border-t border-slate-200/60 text-sm text-slate-600'>
              <div className='flex items-center justify-between py-4 px-2'>
                <p className='truncate max-w-[200px]'>
                  Logged in as: <span className='text-slate-900 font-medium'>{userEmail}</span>
                </p>
                <span
                  className={`px-4 py-1 rounded-full font-semibold text-xs uppercase ${
                    stats?.plan === 'premium'
                      ? 'bg-blue-700 text-white'
                      : 'bg-slate-200 text-slate-800'
                  }`}
                >
                  {stats?.plan || 'Free'}
                </span>
              </div>

              {stats && (
                <div className='w-full bg-white/50 rounded-2xl px-5 py-4 border border-slate-100 mt-2'>
                  <div className='flex items-center justify-between text-sm'>
                    <span>Monthly Meetings</span>
                    <span className='text-xs text-slate-600 font-mono'>
                      {stats.monthlyLimit
                        ? `${stats.monthlyCount} / ${stats.monthlyLimit} Used`
                        : `${stats.monthlyCount} Created (Unlimited)`}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Dashboard