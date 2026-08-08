import { useState } from 'react'
import './App.css'
import { Routes, Route } from "react-router-dom";
import Landing from './components/Landing'
import GetStarted from "./pages/GetStarted";
import HowItWorksPage from './components/HowItWorksPage';
import CandidateLayout from './components/layout/CandidateLayout'
import Dashboard from './pages/candidate/Dashboard'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Routes>
          <Route path="/" element={<Landing />} />
      <Route path="/get-started" element={<GetStarted />} />
      <Route path="/recruiter" element={<GetStarted />} />
      </Routes>
      <Routes>
  <Route path="/" element={<Landing />} />
  <Route path="/how-it-works" element={<HowItWorksPage />} />
  <Route path="/get-started" element={<GetStarted />} />

  <Route path="/candidate" element={<CandidateLayout />}>
    <Route index element={<Dashboard />} />
    
  </Route>
</Routes>
    </>
  )
}

export default App
