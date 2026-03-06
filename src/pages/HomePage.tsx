import { useMyVehicles } from '../contexts/MyVehiclesContext';
import { useMaintenance } from '../contexts/MaintenanceContext';
import { useServices } from '../contexts/ServiceContext';

export default function HomePage() {
  const { myVehicles, updateMyVehicle } = useMyVehicles();
  const { maintenanceRecords } = useMaintenance();
  const { services } = useServices();

  const today = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Non renseignée';
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const getNextCTDate = (dateString?: string) => {
    if (!dateString) return 'Non renseignée';
    const date = new Date(dateString);
    date.setFullYear(date.getFullYear() + 2);
    return date.toLocaleDateString('fr-FR');
  };

  const getLastRevisionDate = (vehicleId: string) => {
    const vehicleRecords = maintenanceRecords
      .filter(r => {
        if (r.vehicleId !== vehicleId) return false;
        
        // Vérifier si l'un des services correspond à "révision complète"
        const serviceIds = r.serviceId.split(',').map(id => id.trim());
        return serviceIds.some(id => {
          const service = services.find(s => s.id === id);
          return service && service.name.toLowerCase().includes('révision complète');
        });
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return vehicleRecords.length > 0 ? formatDate(vehicleRecords[0].date) : 'Aucune révision trouvée';
  };

  const handleKmChange = (vehicle: any, newKm: string) => {
    updateMyVehicle({ ...vehicle, currentKm: newKm });
  };

  return (
    <div className="flex flex-col items-center pt-10 px-4">
      <div className="text-center mb-12">
        <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-pink-500 capitalize">
          {today}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
        {myVehicles.map(vehicle => (
          <div 
            key={vehicle.id} 
            className="bg-gradient-to-br from-blue-500 to-pink-500 rounded-2xl p-6 shadow-xl text-white transform transition-all hover:scale-[1.02]"
          >
            <h2 className="text-2xl font-bold italic mb-2">
              {vehicle.brand} {vehicle.modelName}
            </h2>
            <div className="mb-4 flex flex-col items-start gap-3">
              <p className="text-lg font-bold bg-white/20 inline-block px-3 py-1 rounded-lg">
                {vehicle.licensePlate || 'Sans immatriculation'}
              </p>
              <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg">
                <label className="text-sm font-bold uppercase opacity-80">KM :</label>
                <input 
                  type="text" 
                  value={vehicle.currentKm || ''} 
                  onChange={(e) => handleKmChange(vehicle, e.target.value)}
                  placeholder="Saisir KM"
                  className="bg-transparent border-b border-white/50 focus:border-white outline-none text-white placeholder-white/50 w-24 font-mono text-sm"
                />
              </div>
            </div>
            
            <div className="space-y-3 mt-4 pt-4 border-t border-white/20">
              <div>
                <p className="text-xs uppercase font-bold opacity-80">Prochain contrôle technique</p>
                <p className="font-semibold">{getNextCTDate(vehicle.nextCTDate)}</p>
              </div>
              <div>
                <p className="text-xs uppercase font-bold opacity-80">Dernière révision complète</p>
                <p className="font-semibold">{getLastRevisionDate(vehicle.id)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {myVehicles.length === 0 && (
        <div className="text-center text-gray-500 mt-10">
          <p>Aucun véhicule enregistré. Ajoutez-en un dans les paramètres.</p>
        </div>
      )}
    </div>
  );
}
