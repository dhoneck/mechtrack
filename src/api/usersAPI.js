import apiClient from './axiosInstance';

export const getCurrentBranch = () => apiClient.get(`/users/get-current-branch/`);