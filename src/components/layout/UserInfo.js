import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Box, FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import axios from 'axios';

import './UserInfo.css';

export default function UserInfo() {
  const [user, setUser] = useState(null);
  const [currentBranch, setCurrentBranch] = useState();

  const handleBranchChange = async (event) => {
    // Update the current branch in the DB and set the state
    let branchId = event.target.value;
    try {
      let url = process.env.REACT_APP_API_URL + 'users/update-current-branch/'
      const response = await axios.patch(
        url,
        { 'current_branch': branchId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      setCurrentBranch(branchId);
    } catch (error) {
      console.error('Error updating current branch:', error);
    }
  };

  useEffect(() => {
    console.log('useEffect called in UserInfo');
    async function fetchUser() {
      try {
        const response = await axios.get(process.env.REACT_APP_API_URL + 'users/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setUser(response.data);
        setCurrentBranch(response.data.current_branch);
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
        <InputLabel id='branch-select-label'>Current Branch</InputLabel>
        <Select
          labelId='branch-select-label'
          value={currentBranch || ''}
          onChange={handleBranchChange}
          label='Current Branch'
          size={'small'}
        >
          {user.all_branches.map((branch) => (
            <MenuItem key={branch.id} value={branch.id} >
              {branch.address}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Link to='/logout'><Typography className="user-info__logout" fontSize={'14px'}>Logout</Typography></Link>
    </Box>
  );
}