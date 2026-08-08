import React from 'react'
import log2 from '../assets/log2.svg'
const Footer = () => {
  return (
     <footer className=' bg-[#EEF0EC]'>
      <div className='grid grid-cols-1 p-17 border-t  border-[#DBDCD3] sm:grid-cols-2 lg:grid-cols-2  gap-px'>


 <div className=''>
                <img src={log2} className='h-20 w-auto ' alt='vela'/>
               <div>
                The AI hiring platform that plots the<br/>
                 route between talent and roles.
               </div>
 </div>

<div className=' flex justify-between'>
  <div className=' flex flex-col'>
    <p>Products</p>
    <a href=''>Candidates</a>
    <a href=''>Recruiters</a>
    <a href=''>Companies</a>
    <a href=''>AI engine</a>
  </div>

   <div className='flex flex-col'>
    <p>Company</p>
    <a href=''>About</a>
    <a href=''>Careers</a>
    <a href=''>Contact</a>
  </div>


  <div className='flex flex-col'>
    <p>Resources</p>
    <a href=''>Help center</a>
    <a href=''>API docs</a>
    <a href=''>Status</a>
  </div>
</div>





 </div>
     </footer>
  )  
}

export default Footer