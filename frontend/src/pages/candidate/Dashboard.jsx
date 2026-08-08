import React from 'react'
import { Link } from 'react-router-dom'

const Dashboard = () => {
  return (
    <div className='flex justify-between items-center p-5'>
    <div>
      <h1 className='text-2xl md:text-3xl font-medium text-[#0F1A2B]  '>Good morning,Marisol
        <br/>
        <p className='text-sm text-[#3C4A5E]/70'>Here's where your search stands today</p>
      </h1>
       </div>


    <div>
           <Link to='find-roles' className="cursor-pointer border rounded py-2 px-3 text-white bg-[#A6503E] hover:bg-[#804539] transition-colors">Find Roles</Link>
    </div>
    </div>
  )
}

export default Dashboard