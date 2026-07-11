import { useState } from 'react'
import FormField from '../components/FormField.jsx'
import Badge from '../components/Badge.jsx'
import { predictDiseaseRisk } from '../api/api.js'

const INITIAL = {
  crop: 'rice',
  humidityPercent: 75,
  temperatureC: 26,
  leafWetnessHours: 6,
  recentRainfallMm: 15,
}

export default function DiseaseRisk() {
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
      const data = await predictDiseaseRisk(form)
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
        <div className="page-eyebrow">Module 02</div>
        <h1>Disease Risk Prediction</h1>
        <p className="page-subtitle">
          Flag conditions favorable to fungal and bacterial outbreaks before symptoms
          appear in the field.
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
              <FormField label="Humidity (%)" type="number"
                value={form.humidityPercent} onChange={update('humidityPercent')} />
              <FormField label="Temperature (°C)" type="number"
                value={form.temperatureC} onChange={update('temperatureC')} />
              <FormField label="Leaf wetness (hours)" type="number"
                value={form.leafWetnessHours} onChange={update('leafWetnessHours')} />
              <FormField label="Recent rainfall (mm)" type="number"
                value={form.recentRainfallMm} onChange={update('recentRainfallMm')} />
            </div>
            <button className="btn-primary" type="submit" disabled={loading}>
              {loading ? 'Analyzing…' : 'Assess Risk'}
            </button>
          </form>
          {error && <div className="note-box" style={{ borderColor: 'var(--color-rust)' }}>{error}</div>}
        </div>

        <div className="panel">
          <h3 style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--color-ink-muted)' }}>
            Risk Assessment
          </h3>
          {!result && <p style={{ color: 'var(--color-ink-muted)', fontSize: '14px' }}>Run an assessment to see results here.</p>}
          {result && (
            <>
              <div className="result-stat">
                <span className="result-label">Risk level</span>
                <Badge level={result.risk_level} />
              </div>
              <div className="result-stat">
                <span className="result-label">Risk score</span>
                <span className="result-value">{Math.round(result.risk_score * 100)}%</span>
              </div>
              <div className="result-stat">
                <span className="result-label">Likely diseases</span>
                <span className="result-value" style={{ fontSize: '14px' }}>{result.likely_diseases.join(', ')}</span>
              </div>
              <div className="note-box">{result.recommendation}</div>
            </>
          )}
        </div>
      </div>
    </>
  )
}
