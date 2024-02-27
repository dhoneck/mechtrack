import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Dashboard from './Dashboard';
import Customers from './Customers';
import Vehicles from './Vehicles';
import Services from './Services';
import AddCustomer from './AddCustomer';
import ViewCustomer from './ViewCustomer';
import ViewVehicle from './ViewVehicle';
import PageNotFound from './PageNotFound';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Dashboard />} />
        <Route path='customers' element={<Customers />} />
        <Route path='vehicles' element={<Vehicles />} />
        <Route path='services' element={<Services />} />
        <Route path='customers/:id' element={<ViewCustomer />} />
        <Route path='vehicles/:id' element={<ViewVehicle />} />
        <Route path='add-customer' element={<AddCustomer />} />
        <Route path='*' element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);