import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import EPFCalculator from './pages/EPFCalculator';
import PPFCalculator from './pages/PPFCalculator';
import NPSCalculator from './pages/NPSCalculator';
import SIPCalculator from './pages/SIPCalculator';
import AdvisorPage from './pages/AdvisorPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
      <Route path="/calculator/epf" element={<Layout><EPFCalculator /></Layout>} />
      <Route path="/calculator/ppf" element={<Layout><PPFCalculator /></Layout>} />
      <Route path="/calculator/nps" element={<Layout><NPSCalculator /></Layout>} />
      <Route path="/calculator/sip" element={<Layout><SIPCalculator /></Layout>} />
      <Route path="/advisor" element={<Layout><AdvisorPage /></Layout>} />
    </Routes>
  );
}

export default App;
