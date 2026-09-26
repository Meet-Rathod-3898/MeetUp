import { ArrowLeftIcon } from 'lucide-react'
import  { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import EmptySessions from '../component/sessions/EmptySessions'
import SessionsCard from '../component/sessions/SessionsCard'
import SessionsDetailModel from '../component/sessions/SessionsDetailModel'
import { useAuth } from '@clerk/react'
import { useEffect } from 'react'
import api from '../config/api.js'
import toast from 'react-hot-toast'
import Loader from '../component/Loader.jsx'

const Sessions = () => {
  const [sessions,setSessions] = useState([])
  const [selectedSessions, setSelectedSessions] = useState()
  const navigate = useNavigate()
  const [loading,setLoading] = useState(true);

  const {isLoaded,isSignedIn,getToken} = useAuth()
  useEffect(()=>{
    const fetchSessions = async () => {
      if(!isLoaded || !isSignedIn)return;
      try {
        const token = await getToken();
        if(!token) return;
        const res = await api("/api/meetings/sessions",{headers : {Authorization : `Bearer ${token}`,}})
        setSessions(res.data.meetings || [])
      } catch (_error) {
        toast.error("Failed To load Meeting Sessions");
        
      }finally{
        setLoading(false)
      }
           
    }
    fetchSessions();
  },[isLoaded,isSignedIn,getToken])

  const openSessionsDetails = async(sessionId) => {
   try {
    const token = await getToken();
    const res = await api.get(`/api/meetings/sessions/${meetingId}`,{
     headers : {Authorization : `Bearer ${token}`}
    })
    setSelectedSessions(res.data.meeting);
   } catch (error) {
    toast.error("could not fetch sessions Details");
   }
  }
  if(loading){
    return <Loader text='Loading Meeting History...' />
  }

  return (
    <main className='flex-1 max-w-7xl w-full mx-auto p-6 md:p-12'>
      {/* Page Title & Navigation Header */}
      <Link
        to="/dashboard"
        className='flex items-center text-sm gap-1 mb-4 text-slate-500 hover:text-slate-900 transition-colors'
      >
        <ArrowLeftIcon size={14} /> Go To Dashboard
      </Link>

      <div className='mb-8'>
        <h1 className='text-3xl font-medium tracking-tight text-slate-900'>Meeting Sessions.</h1>
        <p className='text-sm text-slate-500 mt-1'>
          Review Your Past And Active Meeting History, Participant Logs, And Chat Transcripts.
        </p>
      </div>

      {/* Sessions Grid / Empty State */}
      {sessions.length === 0 ? (
        <EmptySessions />
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {sessions.map((session) => (
            <SessionsCard
              key={session.id}
              session={session}
              onOpenDetails={openSessionsDetails}
              onRejoin={(meetingId) => navigate(`/meeting/${meetingId}`)}
            />
          ))}
        </div>
      )}

      {/* Sessions Detail Modal Placeholder */}
     <SessionsDetailModel  session={selectedSessions} onClose={()=> setSelectedSessions(null)}/>
    </main>
  )
}

export default Sessions