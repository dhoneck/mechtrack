import apiClient from './axiosClient';

export const createService = (data) => apiClient.post(`/services/`, data);
export const getService = (id) => apiClient.get(`/services/${id}/`);
export const updateService = (id, data) => apiClient.put(`/services/${id}/`, data);
export const deleteService = (id) => apiClient.delete(`/services/${id}/`);

export const createServiceItem = (data) => apiClient.post(`/service-items/`, data);
export const updateServiceItem = (id, data) => apiClient.post(`/service-items/${id}/`, data);
export const deleteServiceItem = (id) => apiClient.post(`/service-items/${id}/`);

export const getServicesByDate = (date) => apiClient.get(`/services/?service_date=${date}`);
export const getStatusChoices = () => apiClient.get(`/services/status-choices/`);