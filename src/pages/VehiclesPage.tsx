import { Link } from 'react-router-dom';
import { useMyVehicles } from '../contexts/MyVehiclesContext';

export default function VehiclesPage() {
  const { myVehicles } = useMyVehicles();

  return (
    <div className="min-h-screen bg-violet-100 p-8">
      <div className="max-w-4xl mx-auto">
        <Link to="/" className="text-blue-500 hover:underline mb-4 inline-block">{'<'} Retour à l'accueil</Link>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-800">Gestion de Véhicules</h1>
          </div>
          <div className="mt-8">
            {myVehicles.length === 0 ? (
              <div className="text-center text-gray-500">
                <p>Aucun véhicule pour le moment. Veuillez en ajouter un depuis les paramètres.</p>
              </div>
            ) : (
              <ul className="space-y-4">
                {[...myVehicles].sort((a, b) => `${a.brand} ${a.modelName}`.localeCompare(`${b.brand} ${b.modelName}`)).map(vehicle => (
                  <li key={vehicle.id}>
                    <Link to={`/vehicules/${vehicle.id}`} className="block bg-gradient-to-r from-blue-500 to-pink-500 p-4 rounded-lg shadow-md hover:from-blue-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-[1.02] text-white">
                      <p className="font-semibold text-lg">{vehicle.brand} {vehicle.modelName}</p>
                      <p className="opacity-90">{vehicle.engine}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
