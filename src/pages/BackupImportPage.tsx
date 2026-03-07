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

          // Importation des services en premier avec création d'une map de correspondance
          const serviceIdMap: Record<string, string> = {};
          if (importedData.services) {
            importedData.services.forEach((s: Service) => {
              // On cherche si un service avec le même nom existe déjà
              const existingService = services.find(ex => ex.name.toLowerCase().trim() === s.name.toLowerCase().trim());
              if (existingService) {
                // Si oui, on garde l'ID existant pour la correspondance
                serviceIdMap[s.id] = existingService.id;
              } else {
                // Sinon on l'ajoute et on garde le nouvel ID
                const newId = addService(s);
                serviceIdMap[s.id] = newId;
              }
            });
          }

          // Importation des véhicules
          if (importedData.vehicles) {
            importedData.vehicles.forEach((v: VehicleModel) => {
              addMyVehicle(v);
            });
          }

          // Importation du carnet d'entretien avec mise à jour des IDs de services
          if (importedData.maintenanceRecords) {
            importedData.maintenanceRecords.forEach((m: MaintenanceRecord) => {
              // On met à jour les IDs de services dans le record pour qu'ils correspondent aux IDs actuels
              const updatedServiceIds = m.serviceId.split(', ')
                .map(id => serviceIdMap[id] || id)
                .join(', ');
              
              addMaintenanceRecord({ ...m, serviceId: updatedServiceIds });
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
        
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-white/20">
          {/* Tabs */}
          <div className="flex border-b border-gray-100 bg-gray-50/50">
            <div className="px-8 py-4 text-sm font-bold text-blue-600 bg-white border-b-2 border-blue-600">
              Sauvegarde & Import
            </div>
            <Link 
              to="/params/reinitialisation"
              className="px-8 py-4 text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors border-r border-gray-100"
            >
              Réinitialisation
            </Link>
          </div>

          <div className="p-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Sauvegarde & Import</h1>
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
                <h3 className="font-bold text-blue-800 mb-2">Exporter vos données</h3>
                <p className="text-blue-700 text-sm mb-4">Téléchargez un fichier JSON contenant tous vos véhicules, prestations et historiques d'entretien.</p>
                <button 
                  onClick={handleExport} 
                  className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:from-green-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  Exporter les données (JSON)
                </button>
              </div>

              <div className="bg-purple-50 border border-purple-100 rounded-xl p-6">
                <h3 className="font-bold text-purple-800 mb-2">Importer des données</h3>
                <p className="text-purple-700 text-sm mb-4">Restaurez vos données à partir d'un fichier JSON précédemment exporté.</p>
                <label 
                  htmlFor="import-file" 
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer flex justify-center items-center"
                >
                  Importer les données (JSON)
                </label>
                <input type="file" id="import-file" accept=".json" onChange={handleImport} className="hidden" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
