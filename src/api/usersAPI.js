import apiClient from './axiosClient';

export const getCurrentBranch = () => apiClient.get(`/users/get-current-branch/`);