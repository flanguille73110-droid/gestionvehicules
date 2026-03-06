import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useVehicles } from '../contexts/VehicleContext';

export default function AddVehiclePage() {
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState(new Date().getFullYear());
  const { addVehicle } = useVehicles();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (make && model && year) {
      addVehicle({ make, model, year });
      navigate('/vehicules');
    }
  };

  return (
    <div className="min-h-screen bg-violet-100 p-8">
      <div className="max-w-lg mx-auto">
        <Link to="/vehicules" className="text-blue-500 hover:underline mb-4 inline-block">{'<'} Retour à la liste</Link>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Ajouter un nouveau véhicule</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="make" className="block text-sm font-medium text-gray-700">Marque</label>
              <input type="text" id="make" value={make} onChange={(e) => setMake(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" required />
            </div>
            <div>
              <label htmlFor="model" className="block text-sm font-medium text-gray-700">Modèle</label>
              <input type="text" id="model" value={model} onChange={(e) => setModel(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" required />
            </div>
            <div>
              <label htmlFor="year" className="block text-sm font-medium text-gray-700">Année</label>
              <input type="number" id="year" value={year} onChange={(e) => setYear(parseInt(e.target.value, 10))} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" required />
            </div>
            <button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-pink-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:from-blue-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105">
              Enregistrer le véhicule
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
