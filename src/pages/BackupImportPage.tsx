import { Link } from 'react-router-dom';
import { useMyVehicles } from '../contexts/MyVehiclesContext';
import { useMaintenance } from '../contexts/MaintenanceContext';
import { useServices } from '../contexts/ServiceContext'; // Import useServices
import { VehicleModel, MaintenanceRecord, Service } from '../types'; // Import Service type

export default function BackupImportPage() {
  const { myVehicles, addMyVehicle } = useMyVehicles();
  const { maintenanceRecords, addMaintenanceRecord } = useMaintenance();
  const { services, addService } = useServices(); // Get services and addService

  const handleExport = () => {
    const dataToExport = {
      vehicles: myVehicles,
      services: services,
      maintenanceRecords: maintenanceRecords,
    };
    const jsonString = JSON.stringify(dataToExport, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'donnees_vehicules.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target?.result;
      if (data) {
        try {
          const importedData = JSON.parse(data as string);

          // Importation des services en premier
          if (importedData.services) {
            importedData.services.forEach((s: Service) => {
              addService(s);
            });
          }

          // Importation des véhicules
          if (importedData.vehicles) {
            importedData.vehicles.forEach((v: VehicleModel) => {
              addMyVehicle(v);
            });
          }

          // Importation du carnet d'entretien
          if (importedData.maintenanceRecords) {
            importedData.maintenanceRecords.forEach((m: MaintenanceRecord) => {
              addMaintenanceRecord(m);
            });
          }
          alert('Importation terminée !');
        } catch (error) {
          console.error('Erreur lors de l\'importation du fichier JSON:', error);
          alert('Erreur lors de l\'importation du fichier. Veuillez vérifier le format.');
        }
      }
    };
    reader.readAsText(file); // Lire le fichier en tant que texte pour JSON
  };

  return (
    <div className="min-h-screen bg-violet-100 p-8">
      <div className="max-w-4xl mx-auto">
        <Link to="/params" className="text-blue-500 hover:underline mb-4 inline-block">{'<'} Retour aux paramètres</Link>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Sauvegarde & Import</h1>
          <div className="space-y-4">
            <button onClick={handleExport} className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:from-green-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105">
              Exporter les données (JSON)
            </button>
            <div>
              <label htmlFor="import-file" className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 cursor-pointer flex justify-center items-center">
                Importer les données (JSON)
              </label>
              <input type="file" id="import-file" accept=".json" onChange={handleImport} className="hidden" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
