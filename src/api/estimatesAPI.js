import apiClient from './axiosInstance';

export const createEstimate = (data) => apiClient.post(`/estimates/`, data);
export const getEstimate = (id) => apiClient.get(`/estimates/${id}/`);
export const updateEstimate = (id, data) => apiClient.put(`/estimates/${id}/`, data);
export const deleteEstimate = (id) => apiClient.delete(`/estimates/${id}/`);

export const createEstimateItem = (data) => apiClient.post(`/estimate-items/`, data);
export const updateEstimateItem = (id, data) => apiClient.post(`/estimate-items/${id}/`, data);
export const deleteEstimateItem = (id) => apiClient.post(`/estimate-items/${id}/`);