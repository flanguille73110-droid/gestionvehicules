import { Link } from 'react-router-dom';
import { useMyVehicles } from '../contexts/MyVehiclesContext';

export default function PlanningPage() {
  const { myVehicles } = useMyVehicles();

  return (
    <div className="min-h-screen bg-violet-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-pink-600 mb-8">
          Planning
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myVehicles.map(vehicle => (
            <Link 
              key={vehicle.id} 
              to={`/planning/${vehicle.id}`}
              className="bg-gradient-to-br from-blue-500 to-pink-500 rounded-2xl p-6 shadow-md hover:shadow-xl transform transition-all hover:scale-[1.02] border border-white/20 text-white"
            >
              <h2 className="text-xl font-bold mb-2">
                {vehicle.brand} {vehicle.modelName}
              </h2>
              <p className="font-mono bg-white/20 inline-block px-3 py-1 rounded-lg">
                {vehicle.licensePlate || 'Sans immatriculation'}
              </p>
            </Link>
          ))}
          
          {myVehicles.length === 0 && (
            <div className="col-span-full text-center text-gray-500 bg-white p-8 rounded-2xl shadow-sm">
              <p>Aucun véhicule enregistré.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
