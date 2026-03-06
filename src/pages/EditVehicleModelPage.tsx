import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useMyVehicles } from '../contexts/MyVehiclesContext';
import { VehicleModel } from '../types';

export default function EditVehicleModelPage() {
  const { vehicleId } = useParams<{ vehicleId: string }>();
  const navigate = useNavigate();
  const { myVehicles, updateMyVehicle } = useMyVehicles();
  const [vehicle, setVehicle] = useState<VehicleModel | null>(null);
  const [brand, setBrand] = useState('');
  const [modelName, setModelName] = useState('');
  const [engine, setEngine] = useState('');

  useEffect(() => {
    const vehicleToEdit = myVehicles.find(v => v.id === vehicleId);
    if (vehicleToEdit) {
      setVehicle(vehicleToEdit);
      setBrand(vehicleToEdit.brand);
      setModelName(vehicleToEdit.modelName);
      setEngine(vehicleToEdit.engine);
    } else {
      // Handle case where vehicle is not found, maybe redirect
      navigate('/params/marques-modeles');
    }
  }, [vehicleId, myVehicles, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (vehicle) {
      updateMyVehicle({ ...vehicle, brand, modelName, engine });
      navigate('/params/marques-modeles');
    }
  };

  if (!vehicle) {
    return <div>Chargement...</div>; // Or some other loading state
  }

  return (
    <div className="min-h-screen bg-violet-100 p-8">
      <div className="max-w-lg mx-auto">
        <Link to="/params/marques-modeles" className="text-blue-500 hover:underline mb-4 inline-block">{'<'} Retour à la liste</Link>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Modifier le véhicule</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="brand" className="block text-sm font-medium text-gray-700">Nom de la marque</label>
              <input type="text" id="brand" value={brand} onChange={(e) => setBrand(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" required />
            </div>
            <div>
              <label htmlFor="modelName" className="block text-sm font-medium text-gray-700">Nom du modèle</label>
              <input type="text" id="modelName" value={modelName} onChange={(e) => setModelName(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" required />
            </div>
            <div>
              <label htmlFor="engine" className="block text-sm font-medium text-gray-700">Moteur</label>
              <input type="text" id="engine" value={engine} onChange={(e) => setEngine(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" required />
            </div>
            <button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-pink-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:from-blue-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105">
              Enregistrer les modifications
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
