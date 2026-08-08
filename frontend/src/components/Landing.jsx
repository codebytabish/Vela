import React from 'react'
import Navbar from './Navbar'
import Hero from './Hero'
import HowItWorksPage from './HowItWorksPage'
import WhoItsFor from './WhoItsFor'
import AiEngine from './AiEngine'
import Results from './Results'
import Footer from './Footer'
const Landing = () => {
  return (
    <div>
        <Navbar/>
        <Hero/>
        <HowItWorksPage/>
        <WhoItsFor/>
        <AiEngine/>
        <Results/>
        <Footer/>
    </div>
  )
}

export default Landing