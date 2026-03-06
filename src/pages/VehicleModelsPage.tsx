import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMyVehicles } from '../contexts/MyVehiclesContext';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import { VehicleModel } from '../types';

export default function VehicleModelsPage() {
  const { myVehicles, deleteMyVehicle } = useMyVehicles();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState<VehicleModel | null>(null);

  const openModal = (vehicle: VehicleModel) => {
    setVehicleToDelete(vehicle);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setVehicleToDelete(null);
    setIsModalOpen(false);
  };

  const confirmDeletion = () => {
    if (vehicleToDelete) {
      deleteMyVehicle(vehicleToDelete.id);
      closeModal();
    }
  };

  return (
    <div className="min-h-screen bg-violet-100 p-8">
      <div className="max-w-4xl mx-auto">
        <Link to="/params" className="text-blue-500 hover:underline mb-4 inline-block">{'<'} Retour aux paramètres</Link>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-800">Mes véhicules</h1>
            <Link to="/params/marques-modeles/ajouter" className="bg-gradient-to-r from-blue-500 to-pink-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:from-blue-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105">
              Ajouter un véhicule
            </Link>
          </div>
          <div className="mt-8">
            {myVehicles.length === 0 ? (
              <div className="text-center text-gray-500">
                <p>Aucun véhicule pour le moment.</p>
              </div>
            ) : (
              <ul className="space-y-4">
                {myVehicles.map(model => (
                  <li key={model.id} className="bg-gradient-to-r from-blue-500 to-pink-500 p-4 rounded-lg shadow-md flex justify-between items-center text-white">
                    <div>
                      <p className="font-semibold text-lg">{model.brand} {model.modelName}</p>
                      <p className="opacity-90">{model.engine}</p>
                    </div>
                    <div className="flex space-x-4">
                      <Link to={`/params/marques-modeles/modifier/${model.id}`} className="bg-white/20 hover:bg-white/30 px-3 py-1 rounded transition-colors">Modifier</Link>
                      <button onClick={() => openModal(model)} className="bg-red-500/20 hover:bg-red-500/40 px-3 py-1 rounded transition-colors">Supprimer</button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
      {vehicleToDelete && (
        <DeleteConfirmationModal
          open={isModalOpen}
          onClose={closeModal}
          onConfirm={confirmDeletion}
          itemName={`${vehicleToDelete.brand} ${vehicleToDelete.modelName}`}
        />
      )}
    </div>
  );
}
