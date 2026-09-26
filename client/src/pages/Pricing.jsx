import React from 'react'
import  {PricingTable }from '@clerk/react'

const Pricing = () => {
  return (
    <div className='max-w-4xl mx-auto w-full min-h[calc(a00vh-7rem)] flex flex-col gap-5 items justify-center
    p-8'>
      <div className='mb-5'>
        <h1 className='text-3xl font-medium  tracking-tight text-slate-900'>Upgrade Your Plan.</h1>
        <p className='text-sm mt-1 text-slate-500'>Choose The Plan That's Right For You And Unlock All The Features Of MeetUp.</p>
      </div>
       <PricingTable /> 

    </div>
  )
}

export default Pricing