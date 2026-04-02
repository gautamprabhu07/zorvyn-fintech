import api from './axios'

export const getSummary = async (config = {}) => {
  const response = await api.get('/dashboard/summary', config)
  return response.data
}

export const getCategoryBreakdown = async (params, config = {}) => {
  const response = await api.get('/dashboard/category-breakdown', {
    ...config,
    params,
  })
  return response.data
}

export const getRecentActivity = async (params, config = {}) => {
  const response = await api.get('/dashboard/recent', {
    ...config,
    params,
  })
  return response.data
}

export const getMonthlyTrends = async (params, config = {}) => {
  const response = await api.get('/dashboard/trends', {
    ...config,
    params,
  })
  return response.data
}
