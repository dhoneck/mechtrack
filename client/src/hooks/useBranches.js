import { useEffect, useState } from 'react';
import axios from 'axios';

function useBranches() {
  const [branches, setBranches] = useState([]);

  useEffect(() => {
    async function fetchBranches() {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/branches/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setBranches(response.data);
      } catch (error) {
        console.error('Error fetching branches:', error);
      }
    }

    fetchBranches();
  }, []);

  return branches;
}

export default useBranches;