import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Dashboard from './Dashboard';
import Customers from './Customers';
import AddCustomer from './AddCustomer';
import ViewCustomer from './ViewCustomer';
import NoPage from './NoPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Dashboard />} />
        <Route path='customers' element={<Customers />} />
        <Route path='customers/:id' element={<ViewCustomer />} />
        <Route path='add-customer' element={<AddCustomer />} />
        <Route path='*' element={<NoPage />} />
      </Routes>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);