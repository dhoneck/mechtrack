import apiClient from './axiosClient';
import { getCurrentBranch } from './usersAPI';

export const getPricing = async () => {
  const response = await getCurrentBranch();
  const branchId = response.data.current_branch;
  return apiClient.get(`/branches/${branchId}/pricing/`);
};