import { VideoIcon } from 'lucide-react'


const Loader = ({ text = "Loading..." }) => {
  return (
    <div className='fixed inset-0 flex flex-col items-center justify-center bg-slate-50/80 backdrop-blur-md text-slate-900 z-50'>
      <div className='relative flex items-center justify-center'>
        {/* Soft Background Glow */}
        <div className='absolute w-20 h-20 rounded-full bg-primary/10 animate-ping opacity-75' />

        {/* Spinner Ring */}
        <div className='w-16 h-16 rounded-full border-4 border-primary-light border-t-primary animate-spin shadow-xs' />

        {/* Pulsing Center Icon */}
        <VideoIcon className='w-6 h-6 text-primary absolute animate-pulse' />
      </div>

      {/* Status Text */}
      <p className='mt-5 font-semibold text-sm text-slate-600 tracking-wide animate-pulse'>
        {text}
      </p>
    </div>
  )
}

export default Loader