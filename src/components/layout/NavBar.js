import { Link, Outlet } from 'react-router-dom';
import { Button } from '@mui/material'

export default function NavBar({active}) {
  return (
    <>
      <nav>
        <ul>
          {/* Dashboard */}
          <li>
            <Button
              as={Link}
              to='/'
              variant={active === 'Dashboard' ? 'contained' : 'outlined'}
            >
              Dashboard
            </Button>
          </li>
          {/* Customers */}
          <li>
            <Button
              as={Link}
              to='/customers'
              variant={active === 'Customers' ? 'contained' : 'outlined'}
            >
              Customers
            </Button>
          </li>
          {/* Vehicles */}
          <li>
            <Button
              as={Link}
              to='/vehicles'
              variant={active === 'Vehicles' ? 'contained' : 'outlined'}
            >
              Vehicles
            </Button>
          </li>
          {/* Vendors */}
          <li>
            <Button
              as={Link}
              to='/vendors'
              variant={active === 'Vendors' ? 'contained' : 'outlined'}
            >
              Vendors
            </Button>
          </li>
          {/* Reports */}
          <li>
            <Button
              as={Link}
              to='/reports'
              variant={active === 'Reports' ? 'contained' : 'outlined'}
            >
              Reports
            </Button>
          </li>
        </ul>
      </nav>
      <Outlet />
    </>
  )
};