import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import Vehicles from './pages/Vehicles';
import Reports from './pages/Reports';
import AddCustomer from './pages/AddCustomer';
import ViewCustomer from './pages/ViewCustomer';
import ViewVehicle from './pages/ViewVehicle';
import ViewService from './pages/ViewService';
import PageNotFound from './pages/PageNotFound';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Dashboard />} />
        <Route path='customers' element={<Customers />} />
        <Route path='vehicles' element={<Vehicles />} />
        <Route path='reports' element={<Reports />} />
        <Route path='customers/add' element={<AddCustomer />} />
        <Route path='customers/:id' element={<ViewCustomer />} />
        <Route path='vehicles/:id' element={<ViewVehicle />} />
        <Route path='services/:id' element={<ViewService />} />
        <Route path='*' element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);