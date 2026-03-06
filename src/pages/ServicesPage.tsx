import { Link } from 'react-router-dom';
import { useServices } from '../contexts/ServiceContext';
import { useState } from 'react';
import { Pencil, Trash2, X } from 'lucide-react';
import { Service } from '../types';

export default function ServicesPage() {
  const { services, updateService, deleteService } = useServices();
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [deletingService, setDeletingService] = useState<Service | null>(null);
  const [newName, setNewName] = useState('');
  const [newPrice, setNewPrice] = useState('');

  const handleEditClick = (service: Service) => {
    setEditingService(service);
    setNewName(service.name);
    setNewPrice(service.price || '');
  };

  const handleUpdate = () => {
    if (editingService && newName.trim()) {
      updateService({ ...editingService, name: newName.trim(), price: newPrice.trim() });
      setEditingService(null);
    }
  };

  const handleDelete = () => {
    if (deletingService) {
      deleteService(deletingService.id);
      setDeletingService(null);
    }
  };

  const sortedServices = [...services].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="min-h-screen bg-violet-100 p-8">
      <div className="max-w-4xl mx-auto">
        <Link to="/params" className="text-blue-500 hover:underline mb-4 inline-block">{'<'} Retour aux paramètres</Link>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-800">
              Liste des Prestations <span className="text-sm font-normal text-gray-500 ml-2">({services.length})</span>
            </h1>
            <Link to="/params/prestations/ajouter" className="bg-gradient-to-r from-blue-500 to-pink-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:from-blue-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105">
              Ajouter une prestation
            </Link>
          </div>
          <div className="mt-8">
            {sortedServices.length === 0 ? (
              <div className="text-center text-gray-500">
                <p>Aucune prestation pour le moment.</p>
              </div>
            ) : (
              <ul className="space-y-2">
                {sortedServices.map(service => (
                  <li key={service.id} className="bg-gray-50 p-3 rounded-lg shadow-sm flex justify-between items-center group">
                    <div className="flex items-center space-x-4 flex-grow">
                      <p className="font-medium text-gray-800">{service.name}</p>
                      {service.price && (
                        <span className="text-sm text-gray-500 bg-gray-200 px-2 py-0.5 rounded">
                          {service.price} €
                        </span>
                      )}
                    </div>
                    <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEditClick(service)}
                        className="p-1.5 text-blue-500 hover:bg-blue-100 rounded-md transition-colors"
                        title="Modifier"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => setDeletingService(service)}
                        className="p-1.5 text-red-500 hover:bg-red-100 rounded-md transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Modal de modification */}
      {editingService && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">Modifier la prestation</h3>
              <button onClick={() => setEditingService(null)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom de la prestation</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tarif approximatif (€)</label>
                <input
                  type="text"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setEditingService(null)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleUpdate}
                disabled={!newName.trim()}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmation de suppression */}
      {deletingService && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Confirmer la suppression</h3>
            <p className="text-gray-600 mb-6">
              Êtes-vous sûr de vouloir supprimer la prestation <span className="font-semibold text-gray-800">"{deletingService.name}"</span> ? Cette action est irréversible.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setDeletingService(null)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
