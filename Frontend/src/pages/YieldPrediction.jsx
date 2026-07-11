import { useState } from 'react'
import FormField from '../component/FormField.jsx'
import { predictYield } from '../api/api.js'

const INITIAL = {
  crop: 'wheat',
  farmAreaHectares: 2.5,
  soilPh: 6.5,
  avgTemperatureC: 22,
  avgRainfallMm: 600,
  fertilizerKgPerHectare: 60,
}

export default function YieldPrediction() {
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
      const data = await predictYield(form)
      setResult(data)
    } catch (err) {
      setError('Could not reach the prediction service. Is the backend running?')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="page-header">
        <div className="page-eyebrow">Module 01</div>
        <h1>Yield Prediction</h1>
        <p className="page-subtitle">
          Estimate expected crop production from farm area, soil pH, climate, and
          fertilizer application.
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
              <FormField label="Farm area (hectares)" type="number" step="0.1"
                value={form.farmAreaHectares} onChange={update('farmAreaHectares')} />
              <FormField label="Soil pH" type="number" step="0.1"
                value={form.soilPh} onChange={update('soilPh')} />
              <FormField label="Avg temperature (°C)" type="number"
                value={form.avgTemperatureC} onChange={update('avgTemperatureC')} />
              <FormField label="Avg rainfall (mm)" type="number"
                value={form.avgRainfallMm} onChange={update('avgRainfallMm')} />
              <FormField label="Fertilizer (kg/hectare)" type="number"
                value={form.fertilizerKgPerHectare} onChange={update('fertilizerKgPerHectare')} />
            </div>
            <button className="btn-primary" type="submit" disabled={loading}>
              {loading ? 'Predicting…' : 'Predict Yield'}
            </button>
          </form>
          {error && <div className="note-box" style={{ borderColor: 'var(--color-rust)' }}>{error}</div>}
        </div>

        <div className="panel">
          <h3 style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--color-ink-muted)' }}>
            Prediction
          </h3>
          {!result && <p style={{ color: 'var(--color-ink-muted)', fontSize: '14px' }}>Run a prediction to see results here.</p>}
          {result && (
            <>
              <div className="result-stat">
                <span className="result-label">Total predicted yield</span>
                <span className="result-value">{result.predicted_yield_tons} t</span>
              </div>
              <div className="result-stat">
                <span className="result-label">Yield per hectare</span>
                <span className="result-value">{result.yield_per_hectare} t/ha</span>
              </div>
              <div className="result-stat">
                <span className="result-label">Model confidence</span>
                <span className="result-value">{Math.round(result.confidence * 100)}%</span>
              </div>
              <div className="note-box">{result.notes}</div>
            </>
          )}
        </div>
      </div>
    </>
  )
}
