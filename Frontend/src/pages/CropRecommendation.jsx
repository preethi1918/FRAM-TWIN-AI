import { useState } from 'react'
import FormField from '../components/FormField.jsx'
import { recommendCrop } from '../api/api.js'

const INITIAL = {
  soilPh: 6.5,
  nitrogen: 100,
  phosphorus: 50,
  potassium: 50,
  avgTemperatureC: 24,
  avgRainfallMm: 700,
  region: '',
}

export default function CropRecommendation() {
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
      const data = await recommendCrop(form)
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
        <div className="page-eyebrow">Module 05</div>
        <h1>Crop Recommendation</h1>
        <p className="page-subtitle">
          Match soil nutrient levels (N-P-K), pH, and climate against crop profiles to
          find the best-fit crop for your land.
        </p>
      </div>

      <div className="two-col">
        <div className="panel">
          <form onSubmit={submit}>
            <div className="form-grid">
              <FormField label="Soil pH" type="number" step="0.1"
                value={form.soilPh} onChange={update('soilPh')} />
              <FormField label="Nitrogen (kg/ha)" type="number"
                value={form.nitrogen} onChange={update('nitrogen')} />
              <FormField label="Phosphorus (kg/ha)" type="number"
                value={form.phosphorus} onChange={update('phosphorus')} />
              <FormField label="Potassium (kg/ha)" type="number"
                value={form.potassium} onChange={update('potassium')} />
              <FormField label="Avg temperature (°C)" type="number"
                value={form.avgTemperatureC} onChange={update('avgTemperatureC')} />
              <FormField label="Avg rainfall (mm)" type="number"
                value={form.avgRainfallMm} onChange={update('avgRainfallMm')} />
            </div>
            <button className="btn-primary" type="submit" disabled={loading}>
              {loading ? 'Matching…' : 'Recommend Crop'}
            </button>
          </form>
          {error && <div className="note-box" style={{ borderColor: 'var(--color-rust)' }}>{error}</div>}
        </div>

        <div className="panel">
          <h3 style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--color-ink-muted)' }}>
            Recommendation
          </h3>
          {!result && <p style={{ color: 'var(--color-ink-muted)', fontSize: '14px' }}>Run a match to see results here.</p>}
          {result && (
            <>
              <div className="result-stat">
                <span className="result-label">Top choice</span>
                <span className="result-value" style={{ textTransform: 'capitalize' }}>{result.top_choice}</span>
              </div>
              <div className="result-stat">
                <span className="result-label">Suitability score</span>
                <span className="result-value">{Math.round(result.suitability_score * 100)}%</span>
              </div>
              <div className="result-stat">
                <span className="result-label">Other good fits</span>
                <span className="result-value" style={{ fontSize: '14px', textTransform: 'capitalize' }}>
                  {result.recommended_crops.slice(1).join(', ')}
                </span>
              </div>
              <div className="note-box">{result.reasoning}</div>
            </>
          )}
        </div>
      </div>
    </>
  )
}
