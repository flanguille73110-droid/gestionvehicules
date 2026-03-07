/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Home, Car, Wrench, Settings, Calendar, BarChart } from 'lucide-react';
import HomePage from './pages/HomePage';
import VehiclesPage from './pages/VehiclesPage';
import MaintenancePage from './pages/MaintenancePage';
import SettingsPage from './pages/SettingsPage';
import ServicesPage from './pages/ServicesPage';
import AddVehiclePage from './pages/AddVehiclePage';
import AddServicePage from './pages/AddServicePage';
import AddMaintenanceRecordPage from './pages/AddMaintenanceRecordPage';
import { VehicleProvider } from './contexts/VehicleContext';
import { ServiceProvider } from './contexts/ServiceContext';
import { MaintenanceProvider } from './contexts/MaintenanceContext';
import { VehicleModelProvider } from './contexts/VehicleModelContext';
import { MyVehiclesProvider } from './contexts/MyVehiclesContext';
import VehicleModelsPage from './pages/VehicleModelsPage';
import AddVehicleModelPage from './pages/AddVehicleModelPage';
import EditVehicleModelPage from './pages/EditVehicleModelPage';
import VehicleDetailsPage from './pages/VehicleDetailsPage';
import VehicleMaintenanceDetailsPage from './pages/VehicleMaintenanceDetailsPage';
import BackupImportPage from './pages/BackupImportPage';
import ResetPage from './pages/ResetPage';
import EditMaintenanceRecordPage from './pages/EditMaintenanceRecordPage';
import PlanningPage from './pages/PlanningPage';
import PlanningVehiclePage from './pages/PlanningVehiclePage';
import GestionPage from './pages/GestionPage';

export default function App() {
  return (
    <VehicleProvider>
      <ServiceProvider>
        <MaintenanceProvider>
          <VehicleModelProvider>
            <MyVehiclesProvider>
              <div className="flex min-h-screen bg-violet-100">
                {/* Sidebar */}
                <aside className="w-64 bg-white shadow-xl fixed h-full z-10">
                  <div className="p-6">
                    <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-pink-600">
                      AutoSuivi
                    </h1>
                  </div>
                  <nav className="mt-6 px-4 space-y-2">
                    <NavLink to="/" icon={Home} label="Accueil" colorClass="text-blue-500" />
                    <NavLink to="/vehicules" icon={Car} label="Véhicules" colorClass="text-purple-500" />
                    <NavLink to="/entretien" icon={Wrench} label="Entretiens effectués" colorClass="text-orange-500" />
                    <NavLink to="/planning" icon={Calendar} label="Planning" colorClass="text-green-500" />
                    <NavLink to="/gestion" icon={BarChart} label="Gestion" colorClass="text-teal-500" />
                    <NavLink to="/params" icon={Settings} label="Paramètres" colorClass="text-gray-500" />
                  </nav>
                </aside>

                {/* Main Content */}
                <main className="flex-1 ml-64 min-h-screen">
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/vehicules" element={<VehiclesPage />} />
                    <Route path="/vehicules/:vehicleId" element={<VehicleDetailsPage />} />
                    <Route path="/entretien" element={<MaintenancePage />} />
                    <Route path="/entretien/details/:vehicleId" element={<VehicleMaintenanceDetailsPage />} />
                    <Route path="/planning" element={<PlanningPage />} />
                    <Route path="/planning/:vehicleId" element={<PlanningVehiclePage />} />
                    <Route path="/gestion" element={<GestionPage />} />
                    <Route path="/params" element={<SettingsPage />} />
                    <Route path="/params/sauvegarde-import" element={<BackupImportPage />} />
                    <Route path="/params/reinitialisation" element={<ResetPage />} />
                    <Route path="/params/prestations" element={<ServicesPage />} />
                    <Route path="/vehicules/ajouter" element={<AddVehiclePage />} />
                    <Route path="/params/prestations/ajouter" element={<AddServicePage />} />
                    <Route path="/entretien/ajouter/:vehicleId?" element={<AddMaintenanceRecordPage />} />
                    <Route path="/entretien/modifier/:recordId" element={<EditMaintenanceRecordPage />} />
                    <Route path="/params/marques-modeles" element={<VehicleModelsPage />} />
                    <Route path="/params/marques-modeles/ajouter" element={<AddVehicleModelPage />} />
                    <Route path="/params/marques-modeles/modifier/:vehicleId" element={<EditVehicleModelPage />} />
                  </Routes>
                </main>
              </div>
            </MyVehiclesProvider>
          </VehicleModelProvider>
        </MaintenanceProvider>
      </ServiceProvider>
    </VehicleProvider>
  );
}

function NavLink({ to, icon: Icon, label, colorClass }: { to: string; icon: any; label: string; colorClass?: string }) {
  const location = useLocation();
  const isActive = location.pathname === to || (to !== '/' && location.pathname.startsWith(to));

  return (
    <Link
      to={to}
      className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${
        isActive
          ? 'bg-gradient-to-r from-blue-500 to-pink-500 text-white shadow-md'
          : 'text-gray-600 hover:bg-violet-50 hover:text-blue-500'
      }`}
    >
      <Icon size={20} className={isActive ? 'text-white' : (colorClass || '')} />
      <span className="font-medium">{label}</span>
    </Link>
  );
}
