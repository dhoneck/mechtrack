import apiClient from './axiosInstance';

export const getVehicle = (id) => apiClient.get(`/vehicles/${id}/`);
export const updateVehicle = (id, data) => apiClient.put(`/vehicles/${id}/`, data);
export const deleteVehicle = (id) => apiClient.delete(`/vehicles/${id}/`);