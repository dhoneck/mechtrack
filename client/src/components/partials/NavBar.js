import { Outlet, Link } from 'react-router-dom';
import { Button } from '@mui/material'

export default function NavBar() {
  return (
    <>
      <nav>
        <ul>
          <li>
            <Button as={Link} to='/' variant='outlined'>Dashboard</Button>
          </li>
          <li>
            <Button as={Link} to='/customers' variant='outlined'>Customers</Button>
          </li>
          <li>
            <Button as={Link} to='/vehicles' variant='outlined'>Vehicles</Button>
          </li>
          <li>
            <Button as={Link} to='/services' variant='outlined'>Services</Button>
          </li>
        </ul>
      </nav>

      <Outlet />
    </>
  )
};