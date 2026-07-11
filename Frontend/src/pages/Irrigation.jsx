import { useState } from 'react'
import FormField from '../components/FormField.jsx'
import { recommendIrrigation } from '../api/api.js'

const INITIAL = {
  crop: 'maize',
  soilMoisturePercent: 40,
  temperatureC: 29,
  forecastRainMmNext48h: 3,
  farmAreaHectares: 2.5,
}

export default function Irrigation() {
  const [form, setForm] = useState(INITIAL)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const update = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: e.target.type === 'number' ? Number(e.target.value) : e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const data = await recommendIrrigation(form)
      setResult(data)
    } catch (err) {
      setError('Could not reach the recommendation service. Is the backend running?')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="page-header">
        <div className="page-eyebrow">Module 03</div>
        <h1>Smart Irrigation</h1>
        <p className="page-subtitle">
          Combines soil moisture, temperature-driven water demand, and rainfall
          forecast to recommend exactly how much to water — and when.
        </p>
      </div>

      <div className="two-col">
        <div className="panel">
          <form onSubmit={submit}>
            <div className="form-grid">
              <div className="field">
                <label>Crop</label>
                <select value={form.crop} onChange={update('crop')}>
                  <option value="wheat">Wheat</option>
                  <option value="rice">Rice</option>
                  <option value="maize">Maize</option>
                  <option value="cotton">Cotton</option>
                  <option value="sugarcane">Sugarcane</option>
                </select>
              </div>
              <FormField label="Soil moisture (%)" type="number"
                value={form.soilMoisturePercent} onChange={update('soilMoisturePercent')} />
              <FormField label="Temperature (°C)" type="number"
                value={form.temperatureC} onChange={update('temperatureC')} />
              <FormField label="Forecast rain, 48h (mm)" type="number"
                value={form.forecastRainMmNext48h} onChange={update('forecastRainMmNext48h')} />
              <FormField label="Farm area (hectares)" type="number" step="0.1"
                value={form.farmAreaHectares} onChange={update('farmAreaHectares')} />
            </div>
            <button className="btn-primary" type="submit" disabled={loading}>
              {loading ? 'Calculating…' : 'Get Recommendation'}
            </button>
          </form>
          {error && <div className="note-box" style={{ borderColor: 'var(--color-rust)' }}>{error}</div>}
        </div>

        <div className="panel">
          <h3 style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--color-ink-muted)' }}>
            Recommendation
          </h3>
          {!result && <p style={{ color: 'var(--color-ink-muted)', fontSize: '14px' }}>Run a check to see results here.</p>}
          {result && (
            <>
              <div className="result-stat">
                <span className="result-label">Irrigate now?</span>
                <span className="result-value">{result.should_irrigate ? 'Yes' : 'No'}</span>
              </div>
              <div className="result-stat">
                <span className="result-label">Recommended water</span>
                <span className="result-value">{result.recommended_water_liters.toLocaleString()} L</span>
              </div>
              <div className="result-stat">
                <span className="result-label">Optimal time</span>
                <span className="result-value" style={{ fontSize: '14px' }}>{result.optimal_time}</span>
              </div>
              <div className="result-stat">
                <span className="result-label">Water savings vs. fixed schedule</span>
                <span className="result-value">{result.water_savings_percent}%</span>
              </div>
              <div className="note-box">{result.reasoning}</div>
            </>
          )}
        </div>
      </div>
    </>
  )
}
