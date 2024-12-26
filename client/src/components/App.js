import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import PrivateRoute from './auth/PrivateRoute';
import Login from './auth/Login';
import Logout from './auth/Logout';
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import Vehicles from './pages/Vehicles';
import Vendors from './pages/Vendors';
import Reports from './pages/Reports';
import AddCustomer from './pages/AddCustomer';
import AddVendor from './pages/AddVendor';
import ViewCustomer from './pages/ViewCustomer';
import ViewVehicle from './pages/ViewVehicle';
import ViewVendor from './pages/ViewVendor';
import ViewEstimate from './pages/ViewEstimate';
import ViewService from './pages/ViewService';
import PageNotFound from './pages/PageNotFound';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='login' element={<Login />} />
        <Route path='logout' element={<Logout />} />
        <Route element={<PrivateRoute />}>
          <Route index element={<Dashboard />} />
          <Route path='customers' element={<Customers />} />
          <Route path='vehicles' element={<Vehicles />} />
          <Route path='vendors' element={<Vendors />} />
          <Route path='reports' element={<Reports />} />
          <Route path='customers/add' element={<AddCustomer />} />
          <Route path='customers/:id' element={<ViewCustomer />} />
          <Route path='vendors/add' element={<AddVendor />} />
          <Route path='vendors/:id' element={<ViewVendor />} />
          <Route path='vehicles/:id' element={<ViewVehicle />} />
          <Route path='estimates/:eid' element={<ViewEstimate />} />
          <Route path='services/:sid' element={<ViewService />} />
          <Route path='*' element={<PageNotFound />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);