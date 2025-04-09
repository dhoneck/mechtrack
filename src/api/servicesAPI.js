import apiClient from './axiosInstance';

export const getService = (id) => apiClient.get(`/services/${id}/`);
export const updateService = (id, data) => apiClient.put(`/services/${id}/`, data);
export const deleteService = (id) => apiClient.delete(`/services/${id}/`);