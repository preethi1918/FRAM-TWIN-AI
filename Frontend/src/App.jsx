import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import './App.css'
import Dashboard from './pages/Dashboard.jsx'
import YieldPrediction from './pages/YieldPrediction.jsx'
import DiseaseRisk from './pages/DiseaseRisk.jsx'
import Irrigation from './pages/Irrigation.jsx'
import ProfitEstimation from './pages/ProfitEstimation.jsx'
import CropRecommendation from './pages/CropRecommendation.jsx'

const NAV_ITEMS = [
  { to: '/', label: 'Overview', icon: '::', end: true },
  { to: '/yield', label: 'Yield Prediction', icon: '01' },
  { to: '/disease', label: 'Disease Risk', icon: '02' },
  { to: '/irrigation', label: 'Irrigation', icon: '03' },
  { to: '/profit', label: 'Profit Estimate', icon: '04' },
  { to: '/crop', label: 'Crop Recommend', icon: '05' },
]

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">Farm Twin AI</div>
      <div className="brand-tag">Digital Twin Console</div>
      <ul className="nav-list">
        {NAV_ITEMS.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              end={item.end}
              className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
      <div className="sidebar-footer">v1.0.0 — local dev</div>
    </aside>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <Sidebar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/yield" element={<YieldPrediction />} />
            <Route path="/disease" element={<DiseaseRisk />} />
            <Route path="/irrigation" element={<Irrigation />} />
            <Route path="/profit" element={<ProfitEstimation />} />
            <Route path="/crop" element={<CropRecommendation />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}
