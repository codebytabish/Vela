import { Routes, Route } from "react-router-dom";
import Landing from './components/Landing'
import GetStarted from "./pages/GetStarted";
import HowItWorksPage from './components/HowItWorksPage';
import Login from "./pages/Login";
import Register from "./pages/Register";


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
import Upload from './pages/candidate/Upload';

import RecruiterLayout from './components/layout/RecruiterLayout';
 import RecruiterDashboard from './pages/recruiter/RecruiterDashboard'; 
import CreateJobs from "./pages/recruiter/CreateJobs";
import ManageJobs from "./pages/recruiter/ManageJobs";
import AiRanking from "./pages/recruiter/AiRanking";
import CandidateProfile from "./pages/recruiter/CandidateProfile";
import PipelineBoard from "./pages/recruiter/PipelineBoard";
import InterviewScheduling from "./pages/recruiter/InterviewScheduling";
import Analytics from "./pages/recruiter/Analytics";
import RecruiterSettings from "./pages/recruiter/RecruiterSettings";
import Messages from "./pages/recruiter/Messages";
import CompanyProfile from "./pages/recruiter/CompanyProfile";
import ManageRecruiter from "./pages/recruiter/ManageRecruiter";
import RolesPermission from "./pages/recruiter/RolesPermission";

import AdminLayout from "./components/layout/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Users from "./pages/admin/Users";
import AdminCompanies from "./pages/admin/AdminCompanies";
import AdminModeration from "./pages/admin/AdminModeration";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import SystemHealth from "./pages/admin/SystemHealth";
import AdminSetting from "./pages/admin/AdminSetting";


function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/get-started" element={<GetStarted />} />
      <Route path="/how-it-works" element={<HowItWorksPage />} />
      <Route path="/login" element={<Login/>} />
      <Route path="/register" element={<Register/>} />

      <Route path="/candidate" element={<CandidateLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="builder" element={<Builder />} />
        <Route path="upload" element={<Upload />} />
        <Route path="improve" element={<AiImprovement />} />
        <Route path="score" element={<AtsScore />} />
        <Route path="skills" element={<SkillsGraph />} />
        <Route path="advice" element={<CareerAdvice />} />
        <Route path="portfolio" element={<Portfolio />} />
        <Route path="search" element={<Recommendation />} />
        <Route path="detail" element={<JobDetail />} />
        <Route path="applications" element={<Applications />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      <Route path="/recruiter" element={<RecruiterLayout />}>
        {<Route index element={<RecruiterDashboard />} /> }
        <Route path="create" element={<CreateJobs />} />
        <Route path="manage" element={<ManageJobs />} />
        <Route path="ranking" element={<AiRanking />} />
        <Route path="profile" element={<CandidateProfile />} />
        <Route path="pipeline" element={<PipelineBoard />} />
        <Route path="scheduling" element={<InterviewScheduling />} />
        <Route path="analysis" element={<Analytics />} />
        <Route path="settings" element={<RecruiterSettings />} />
        <Route path="messages" element={<Messages />} />
        <Route path="company" element={<CompanyProfile />} />
        <Route path="team" element={<ManageRecruiter />} />
        <Route path="permissions" element={<RolesPermission />} />
      </Route>

            <Route path="/admin" element={<AdminLayout />}>
  <Route index element={<AdminDashboard />} />
    <Route path="users" element={<Users />} />
      <Route path="companies" element={<AdminCompanies />} />
  <Route path="moderation" element={<AdminModeration />} />

  <Route path="analytics" element={<AdminAnalytics />} />
    <Route path="health" element={<SystemHealth />} />
  <Route path="settings" element={<AdminSetting />} />



                </Route>

    </Routes>
  )
}

export default App