import { Outlet, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Button } from '@mui/material'

export default function NavBar() {
  const [activeLink, setActiveLink] = useState('Dashboard');

  const handleLinkClick = (link, event) => {
    event.preventDefault();
    if (link !== activeLink) {
      setActiveLink(link);
    }
  };

  return (
    <>
      <nav>
        <ul>
          <li>
            <Button
              as={Link}
              to='/'
              variant={activeLink === 'Dashboard' ? 'contained': 'outlined'}
              onClick={(event) => handleLinkClick('Dashboard', event)}
            >
              Dashboard
            </Button>
          </li>
          <li>
            <Button
              as={Link}
              to='/customers'
              variant={activeLink === 'Customers' ? 'contained': 'outlined'}
              onClick={(event) => handleLinkClick('Customers', event)}
            >
              Customers
            </Button>
          </li>
          <li>
            <Button
              as={Link}
              to='/vehicles'
              variant={activeLink === 'Vehicles' ? 'contained': 'outlined'}
              onClick={(event) => handleLinkClick('Vehicles', event)}
            >
              Vehicles
            </Button>
          </li>
          <li>
            <Button
              as={Link}
              to='/reports'
              variant={activeLink === 'Reports' ? 'contained': 'outlined'}
              onClick={(event) => handleLinkClick('Reports', event)}
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