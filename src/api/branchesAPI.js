import apiClient from './axiosInstance';
import { getCurrentBranch } from './usersAPI';

export const getPricing = async () => {
  const response = await getCurrentBranch();
  const branchId = response.data.current_branch;
  console.log('branchId');
  console.log(branchId);
  return apiClient.get(`/branches/${branchId}/pricing/`);
};