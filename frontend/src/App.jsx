import { useState } from 'react'
import './App.css'
import { Routes, Route } from "react-router-dom";
import Landing from './components/Landing'
import GetStarted from "./pages/GetStarted";
import HowItWorksPage from './components/HowItWorksPage';
import CandidateLayout from './components/layout/CandidateLayout'
import Dashboard from './pages/candidate/Dashboard'
import Builder from './pages/candidate/Builder';
import AiImprovement from './pages/candidate/AiImprovement';
import AtsScore from './pages/candidate/AtsScore';
import SkillsGraph from './pages/candidate/SkillsGraph';
import CareerAdvice from './pages/candidate/CareerAdvice';
import Portfolio from './pages/candidate/Portfolio';
import Recommendation from './pages/candidate/Recommendation';
import JobDetail from './pages/candidate/JobDetail';
import Applications from './pages/candidate/Applications';
import Settings from './pages/candidate/Settings';
import RecruiterLayout from './components/layout/RecruiterLayout';
import Upload from './pages/candidate/Upload';
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
  <Route path="/how-it-works" element={<HowItWorksPage />} />
  <Route path="/get-started" element={<GetStarted />} />

  <Route path="/candidate" element={<CandidateLayout />}>
    <Route index element={<Dashboard />} />
    <Route path="builder" element={<Builder />} />
    <Route path="upload" element={<Upload />} />
    <Route path="improve" element={<AiImprovement />} />
    <Route path="score" element={<AtsScore />} />
    <Route path="Skills" element={<SkillsGraph />} />
    <Route path="advice" element={<CareerAdvice  />} />
    <Route path="portfolio" element={<Portfolio  />} />
    <Route path="search" element={<Recommendation  />} />
    <Route path="detail" element={<JobDetail  />} />
    <Route path="applications" element={<Applications  />} />
    <Route path="settings" element={<Settings  />} />
  </Route>
  <Route path="/recruiter" element={<RecruiterLayout/>}>
      <Route index element={<Dashboard />} />

</Route>

</Routes>
    </>
  )
}

export default App
