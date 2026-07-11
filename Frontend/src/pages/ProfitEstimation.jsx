import { useState } from 'react'
import FormField from '../components/FormField.jsx'
import { estimateProfit } from '../api/api.js'

const INITIAL = {
  crop: 'wheat',
  farmAreaHectares: 2.5,
  expectedYieldTons: 8,
  marketPricePerTon: 250,
  inputCostTotal: 900,
}

export default function ProfitEstimation() {
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
      const data = await estimateProfit(form)
      setResult(data)
    } catch (err) {
      setError('Could not reach the estimation service. Is the backend running?')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="page-header">
        <div className="page-eyebrow">Module 04</div>
        <h1>Profit Estimation</h1>
        <p className="page-subtitle">
          Model revenue, cost, and breakeven yield so you can plan financially before
          the season starts.
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
              <FormField label="Expected yield (tons)" type="number" step="0.1"
                value={form.expectedYieldTons} onChange={update('expectedYieldTons')} />
              <FormField label="Market price (per ton)" type="number"
                value={form.marketPricePerTon} onChange={update('marketPricePerTon')} />
              <FormField label="Total input cost" type="number"
                value={form.inputCostTotal} onChange={update('inputCostTotal')} />
            </div>
            <button className="btn-primary" type="submit" disabled={loading}>
              {loading ? 'Calculating…' : 'Estimate Profit'}
            </button>
          </form>
          {error && <div className="note-box" style={{ borderColor: 'var(--color-rust)' }}>{error}</div>}
        </div>

        <div className="panel">
          <h3 style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--color-ink-muted)' }}>
            Financial Summary
          </h3>
          {!result && <p style={{ color: 'var(--color-ink-muted)', fontSize: '14px' }}>Run an estimate to see results here.</p>}
          {result && (
            <>
              <div className="result-stat">
                <span className="result-label">Gross revenue</span>
                <span className="result-value">${result.gross_revenue.toLocaleString()}</span>
              </div>
              <div className="result-stat">
                <span className="result-label">Total cost</span>
                <span className="result-value">${result.total_cost.toLocaleString()}</span>
              </div>
              <div className="result-stat">
                <span className="result-label">Net profit</span>
                <span className="result-value" style={{ color: result.net_profit >= 0 ? 'var(--color-teal)' : 'var(--color-rust)' }}>
                  ${result.net_profit.toLocaleString()}
                </span>
              </div>
              <div className="result-stat">
                <span className="result-label">Profit margin</span>
                <span className="result-value">{result.profit_margin_percent}%</span>
              </div>
              <div className="result-stat">
                <span className="result-label">Breakeven yield</span>
                <span className="result-value">{result.breakeven_yield_tons} t</span>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}
