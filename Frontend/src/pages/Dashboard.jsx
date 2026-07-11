import { Link } from 'react-router-dom'

const FEATURES = [
  { to: '/yield', index: '01', title: 'Yield Prediction', desc: 'Estimate future crop production from soil, climate and fertilizer inputs.' },
  { to: '/disease', index: '02', title: 'Disease Risk Prediction', desc: 'Catch fungal and bacterial outbreak conditions before they spread.' },
  { to: '/irrigation', index: '03', title: 'Smart Irrigation', desc: 'Water only when the soil and forecast say you need to.' },
  { to: '/profit', index: '04', title: 'Profit Estimation', desc: 'Model revenue, cost and breakeven yield before you commit.' },
  { to: '/crop', index: '05', title: 'Crop Recommendation', desc: 'Match your soil NPK and climate to the best-fit crop.' },
]

const IMPACT_STATS = [
  { value: '+30%', label: 'Crop yield increase' },
  { value: '-40%', label: 'Water usage reduction' },
  { value: '60%', label: 'Faster disease detection' },
  { value: '+25%', label: 'Profitability increase' },
]

export default function Dashboard() {
  return (
    <>
      <div className="page-header">
        <div className="page-eyebrow">Farm Twin AI — Overview</div>
        <h1>Your farm, mirrored in data.</h1>
        <p className="page-subtitle">
          A digital twin pulls weather, soil, and sensor readings into one model of your
          farm so every irrigation, planting, and spending decision is backed by data,
          not guesswork.
        </p>
      </div>

      <div className="stat-grid">
        {IMPACT_STATS.map((s) => (
          <div className="stat-card" key={s.label}>
            <div className="value">{s.value}</div>
            <div className="label">{s.label}</div>
          </div>
        ))}
      </div>

      <h2 style={{ fontSize: '18px', marginBottom: '16px' }}>Modules</h2>
      <div className="feature-grid">
        {FEATURES.map((f) => (
          <Link to={f.to} className="feature-card" key={f.to}>
            <div className="index">{f.index}</div>
            <h3>{f.title}</h3>
            <p>{f.desc}</p>
          </Link>
        ))}
      </div>
    </>
  )
}
