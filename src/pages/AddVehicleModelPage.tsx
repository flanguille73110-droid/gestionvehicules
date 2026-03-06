import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useVehicleModels } from '../contexts/VehicleModelContext';
import { useMyVehicles } from '../contexts/MyVehiclesContext';
import { vehicleData } from '../data/vehicleData';

export default function AddVehicleModelPage() {
  const { vehicleModels, addVehicleModel } = useVehicleModels();
  const { addMyVehicle } = useMyVehicles();
  const navigate = useNavigate();

  const [brands, setBrands] = useState<string[]>([]);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [newBrand, setNewBrand] = useState('');
  
  const [models, setModels] = useState<string[]>([]);
  const [selectedModel, setSelectedModel] = useState('');
  const [newModel, setNewModel] = useState('');

  const [engines, setEngines] = useState<string[]>([]);
  const [selectedEngine, setSelectedEngine] = useState('');
  const [newEngine, setNewEngine] = useState('');

  useEffect(() => {
    const uniqueBrands = [...new Set(vehicleModels.map(vm => vm.brand))];
    setBrands(['Autre', ...uniqueBrands]);
  }, [vehicleModels]);

  useEffect(() => {
    if (selectedBrand && selectedBrand !== 'Autre') {
      const brandModels = [...new Set(vehicleModels.filter(vm => vm.brand === selectedBrand).map(vm => vm.modelName))];
      setModels(['Autre', ...brandModels]);
    } else {
      setModels(['Autre']);
    }
    setSelectedModel('');
    setNewBrand('');
  }, [selectedBrand, vehicleModels]);

  useEffect(() => {
    if (selectedModel && selectedModel !== 'Autre') {
      // Get engines from static data
      const staticEngines = vehicleData[selectedBrand as keyof typeof vehicleData]?.[selectedModel as keyof typeof vehicleData[keyof typeof vehicleData]] || [];
      // Get engines from context (user-added)
      const dynamicEngines = [...new Set(vehicleModels.filter(vm => vm.brand === selectedBrand && vm.modelName === selectedModel).map(vm => vm.engine))];
      // Combine and remove duplicates
      const combinedEngines = [...new Set([...staticEngines, ...dynamicEngines])];
      setEngines(['Autre', ...combinedEngines]);
    } else {
      setEngines(['Autre']);
    }
    setSelectedEngine('');
    setNewModel('');
  }, [selectedBrand, selectedModel, vehicleModels]);

  useEffect(() => {
    setNewEngine('');
  }, [selectedEngine]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalBrand = selectedBrand === 'Autre' ? newBrand : selectedBrand;
    const finalModel = selectedModel === 'Autre' ? newModel : selectedModel;
    const finalEngine = selectedEngine === 'Autre' ? newEngine : selectedEngine;

    if (finalBrand && finalModel && finalEngine) {
      const vehicle = { brand: finalBrand, modelName: finalModel, engine: finalEngine };
      addVehicleModel(vehicle);
      addMyVehicle(vehicle);
      navigate('/params/marques-modeles');
    }
  };

  return (
    <div className="min-h-screen bg-violet-100 p-8">
      <div className="max-w-lg mx-auto">
        <Link to="/params/marques-modeles" className="text-blue-500 hover:underline mb-4 inline-block">{'<'} Retour à la liste</Link>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Ajouter un nouveau modèle</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="brand" className="block text-sm font-medium text-gray-700">Nom de la marque</label>
              <select id="brand" value={selectedBrand} onChange={(e) => setSelectedBrand(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" required>
                <option value="" disabled>Sélectionnez une marque</option>
                {brands.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
              {selectedBrand === 'Autre' && (
                <input type="text" value={newBrand} onChange={(e) => setNewBrand(e.target.value)} placeholder="Nouvelle marque" className="mt-2 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" required />
              )}
            </div>
            <div>
              <label htmlFor="modelName" className="block text-sm font-medium text-gray-700">Nom du modèle</label>
              <select id="modelName" value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" required disabled={!selectedBrand}>
                <option value="" disabled>Sélectionnez un modèle</option>
                {models.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
              {selectedModel === 'Autre' && (
                <input type="text" value={newModel} onChange={(e) => setNewModel(e.target.value)} placeholder="Nouveau modèle" className="mt-2 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" required />
              )}
            </div>
            <div>
              <label htmlFor="engine" className="block text-sm font-medium text-gray-700">Moteur</label>
              <select id="engine" value={selectedEngine} onChange={(e) => setSelectedEngine(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" required disabled={!selectedModel}>
                <option value="" disabled>Sélectionnez un moteur</option>
                {engines.map(eng => <option key={eng} value={eng}>{eng}</option>)}
              </select>
              {selectedEngine === 'Autre' && (
                <input type="text" value={newEngine} onChange={(e) => setNewEngine(e.target.value)} placeholder="Nouveau moteur" className="mt-2 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" required />
              )}
            </div>
            <button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-pink-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:from-blue-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105">
              Ajouter le véhicule
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
