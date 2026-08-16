import { Routes, Route } from 'react-router-dom';
import DashboardClone from './DashboardClone';
import CreateInvoice from './CreateInvoice';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<DashboardClone />} />
      <Route path="/create-invoice" element={<CreateInvoice />} />
    </Routes>
  );
}