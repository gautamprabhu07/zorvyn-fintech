import api from './axios'

export const getRecords = async (params, config = {}) => {
  const {
    page,
    limit,
    type,
    category,
    startDate,
    endDate,
    search,
  } = params || {}

  const queryParams = {
    ...(page ? { page } : {}),
    ...(limit ? { limit } : {}),
    ...(type ? { type } : {}),
    ...(category ? { category } : {}),
    ...(startDate ? { startDate } : {}),
    ...(endDate ? { endDate } : {}),
    ...(search ? { search } : {}),
  }

  const response = await api.get('/records', {
    ...config,
    params: queryParams,
  })
  return response.data
}

export const createRecord = async (data) => {
  const response = await api.post('/records', data)
  return response.data
}

export const updateRecord = async (id, data) => {
  const response = await api.patch(`/records/${id}`, data)
  return response.data
}

export const deleteRecord = async (id) => {
  const response = await api.delete(`/records/${id}`)
  return response.data
}
