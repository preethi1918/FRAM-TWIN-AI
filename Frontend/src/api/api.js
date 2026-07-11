import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

export const predictYield = (data) => api.post('/yield/predict', data).then(r => r.data)
export const predictDiseaseRisk = (data) => api.post('/disease/risk', data).then(r => r.data)
export const recommendIrrigation = (data) => api.post('/irrigation/recommend', data).then(r => r.data)
export const estimateProfit = (data) => api.post('/profit/estimate', data).then(r => r.data)
export const recommendCrop = (data) => api.post('/crop/recommend', data).then(r => r.data)

export default api
