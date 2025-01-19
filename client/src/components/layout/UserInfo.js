import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Box, FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import axios from 'axios';

import useBranches from '../../hooks/useBranches';

import './UserInfo.css';

export default function UserInfo() {
  const [user, setUser] = useState(null);
  const branches = useBranches();
  const [defaultBranch, setDefaultBranch] = useState('');

  const handleBranchChange = (event) => {
    setDefaultBranch(event.target.value);
    // Optionally, save the selected branch to local storage or make an API call to save the preference
    localStorage.setItem('defaultBranch', event.target.value);
  };

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/users/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setUser(response.data);
        console.log('User data:', response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }

    fetchUser();
  }, []);

  if (!user) {
    return <Typography></Typography>;
  }

  return (
    <Box className="user-info">
      <Typography className="user-info__business" fontSize={'12px'}>{user.business_name}</Typography>
      <Typography className="user-info__name" fontSize={'12px'}>{user.full_name}</Typography>
      <Typography className="user-info__email" fontSize={'12px'}>{user.email}</Typography>
      <FormControl fullWidth sx={{ mt: 2 }}>
        <InputLabel id='branch-select-label'>Default Branch</InputLabel>
        <Select
          labelId='branch-select-label'
          value={defaultBranch}
          onChange={handleBranchChange}
          label='Default Branch'
        >
          {branches.map((branch) => (
            <MenuItem key={branch.id} value={branch.id}>
              {branch.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Link to='/logout'><Typography className="user-info__logout" fontSize={'12px'}>Logout</Typography></Link>
    </Box>
  );
}