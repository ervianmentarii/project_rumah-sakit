import { Routes, Route } from 'react-router-dom';
import DashboardLayout from './components/layout/DashboardLayout';
import ProtectedRoute from './components/layout/ProtectedRoute';
import RoleRoute from './components/layout/RoleRoute';

// Public Pages
import HomePage from './pages/HomePage';
import StaffLoginPage from './pages/auth/StaffLoginPage';
import PatientLoginPage from './pages/auth/PatientLoginPage';
import QueueDisplayPage from './pages/queue/QueueDisplayPage';
import NotFoundPage from './pages/NotFoundPage';

// Protected Pages
import DashboardPage from './pages/dashboard/DashboardPage';
import PatientRegistrationPage from './pages/registration/PatientRegistrationPage';
import QueueRegistrationPage from './pages/registration/QueueRegistrationPage';
import QueueManagementPage from './pages/queue/QueueManagementPage';
import TriagePage from './pages/triage/TriagePage';
import DoctorDashboardPage from './pages/doctor/DoctorDashboardPage';
import MedicalRecordPage from './pages/doctor/MedicalRecordPage';
import PatientHistoryPage from './pages/doctor/PatientHistoryPage';
import CashierPage from './pages/cashier/CashierPage';
import PharmacyPage from './pages/pharmacy/PharmacyPage';
import MedicineManagementPage from './pages/pharmacy/MedicineManagementPage';
import UserManagementPage from './pages/admin/UserManagementPage';
import TariffManagementPage from './pages/admin/TariffManagementPage';
import ReportPage from './pages/admin/ReportPage';

export default function App() {
  return (
    <Routes>
      {/* === Public Routes === */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login/staff" element={<StaffLoginPage />} />
      <Route path="/login/pasien" element={<PatientLoginPage />} />
      <Route path="/login" element={<StaffLoginPage />} />
      <Route path="/queues/display" element={<QueueDisplayPage />} />

      {/* === Protected Routes (Staff Dashboard) === */}
      <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<DashboardPage />} />

        {/* Resepsionis Routes */}
        <Route element={<RoleRoute allowedRoles={['admin', 'resepsionis']} />}>
          <Route path="/patients" element={<PatientRegistrationPage />} />
          <Route path="/patients/register" element={<PatientRegistrationPage />} />
          <Route path="/queues" element={<QueueManagementPage />} />
          <Route path="/queues/register" element={<QueueRegistrationPage />} />
        </Route>

        {/* Perawat Routes */}
        <Route element={<RoleRoute allowedRoles={['admin', 'perawat', 'dokter']} />}>
          <Route path="/triage" element={<TriagePage />} />
        </Route>

        {/* Dokter Routes */}
        <Route element={<RoleRoute allowedRoles={['admin', 'dokter']} />}>
          <Route path="/doctor" element={<DoctorDashboardPage />} />
          <Route path="/doctor/examine/:queueId" element={<MedicalRecordPage />} />
          <Route path="/doctor/history/:patientId" element={<PatientHistoryPage />} />
        </Route>

        {/* Kasir Routes */}
        <Route element={<RoleRoute allowedRoles={['admin', 'kasir']} />}>
          <Route path="/cashier" element={<CashierPage />} />
        </Route>

        {/* Apoteker Routes */}
        <Route element={<RoleRoute allowedRoles={['admin', 'apoteker']} />}>
          <Route path="/pharmacy" element={<PharmacyPage />} />
          <Route path="/pharmacy/medicines" element={<MedicineManagementPage />} />
        </Route>

        {/* Admin Routes */}
        <Route element={<RoleRoute allowedRoles={['admin']} />}>
          <Route path="/admin/users" element={<UserManagementPage />} />
          <Route path="/admin/tariffs" element={<TariffManagementPage />} />
          <Route path="/admin/reports" element={<ReportPage />} />
        </Route>
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
