import { Link } from 'react-router-dom';
import { useMyVehicles } from '../contexts/MyVehiclesContext';

export default function MaintenancePage() {
  const { myVehicles } = useMyVehicles();

  return (
    <div className="min-h-screen bg-violet-100 p-8">
      <div className="max-w-4xl mx-auto">
        <Link to="/" className="text-blue-500 hover:underline mb-4 inline-block">{'<'} Retour à l'accueil</Link>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Carnet d'Entretien</h1>
          <div>
            <p className="mb-4 text-gray-600">Veuillez sélectionner un véhicule pour voir son carnet d'entretien.</p>
            {myVehicles.length > 0 ? (
              <ul className="space-y-2">
                {myVehicles.map(v => (
                  <li key={v.id}>
                    <Link to={`/entretien/details/${v.id}`} className="block bg-gradient-to-r from-blue-500 to-pink-500 text-white font-semibold py-3 px-4 rounded-lg hover:from-blue-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-[1.02] shadow-md">
                      {v.brand} {v.modelName}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">Aucun véhicule ajouté. Veuillez d'abord ajouter un véhicule via les paramètres.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
