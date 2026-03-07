import { Link, useParams, useNavigate } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { useMyVehicles } from '../contexts/MyVehiclesContext';
import { useServices } from '../contexts/ServiceContext';
import { useMaintenance } from '../contexts/MaintenanceContext';
import { MaintenanceRecord } from '../types';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal'; // Import the modal
import { FileText, Edit, Trash2 } from 'lucide-react'; // Import icons
import { base64ToBlobUrl } from '../utils/fileUtils'; // Import the utility function

export default function VehicleMaintenanceDetailsPage() {
  const { vehicleId } = useParams<{ vehicleId: string }>();
  const navigate = useNavigate();
  const { myVehicles } = useMyVehicles();
  const { services } = useServices();
  const { maintenanceRecords, deleteMaintenanceRecord } = useMaintenance(); // Get delete function
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc'); // Default to descending
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState<MaintenanceRecord | null>(null);

  const vehicle = myVehicles.find(v => v.id === vehicleId);
  const records = maintenanceRecords.filter(r => r.vehicleId === vehicleId);

  const sortedRecords = useMemo(() => {
    const sortableRecords = [...records];
    sortableRecords.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });
    return sortableRecords;
  }, [records, sortOrder]);

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-violet-100 p-8">
        <div className="max-w-full mx-auto px-4">
          <Link to="/entretien" className="text-blue-500 hover:underline mb-4 inline-block">{'<'} Retour au carnet d'entretien</Link>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <p className="text-red-500">Véhicule non trouvé.</p>
          </div>
        </div>
      </div>
    );
  }

  const getServiceNames = (serviceIds: string) => {
    if (!serviceIds) return '-';
    // Split by comma with optional space
    const ids = serviceIds.split(/, ?/).filter(Boolean);
    return ids.map(id => {
      const trimmedId = id.trim();
      // Try to find by ID
      let service = services.find(s => s.id === trimmedId);
      if (service) return service.name;
      
      // If not found by ID, try to find by name (case insensitive)
      service = services.find(s => s.name.toLowerCase().trim() === trimmedId.toLowerCase().trim());
      if (service) return service.name;
 
      // If still not found, return the id itself (it might be the name already)
      return trimmedId;
    }).join(', ');
  };

  const toggleSortOrder = () => {
    setSortOrder(prevOrder => (prevOrder === 'asc' ? 'desc' : 'asc'));
  };

  const handleDeleteClick = (record: MaintenanceRecord) => {
    setRecordToDelete(record);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (recordToDelete) {
      deleteMaintenanceRecord(recordToDelete.id);
      setIsDeleteModalOpen(false);
      setRecordToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setRecordToDelete(null);
  };

  return (
    <div className="min-h-screen bg-violet-100 p-8">
      <div className="max-w-full mx-auto px-4">
        <Link to="/entretien" className="text-blue-500 hover:underline mb-4 inline-block">{'<'} Retour au carnet d'entretien</Link>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-800">
              Entretien de <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-pink-500">{vehicle.brand} {vehicle.modelName}</span>
            </h1>
            <button onClick={() => navigate(`/entretien/ajouter/${vehicle.id}`)} className="bg-gradient-to-r from-blue-500 to-pink-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:from-blue-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105">
              Ajouter un entretien
            </button>
          </div>
          {sortedRecords.length === 0 ? (
            <p className="text-gray-500">Aucun entretien enregistré pour ce véhicule.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-lg shadow-md">
                <thead>
                  <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                    <th className="py-3 px-6 text-left cursor-pointer" onClick={toggleSortOrder}>
                      Date {sortOrder === 'asc' ? '▲' : '▼'}
                    </th>
                    <th className="py-3 px-6 text-left">KM</th>
                    <th className="py-3 px-6 text-left">Prestations</th>
                    <th className="py-3 px-6 text-left">Prestataire</th>
                    <th className="py-3 px-6 text-left">Montant</th>
                    <th className="py-3 px-6 text-left">Observation</th>
                    <th className="py-3 px-6 text-left">Factures</th>
                    <th className="py-3 px-6 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 text-sm font-light">
                  {sortedRecords.map(record => (
                    <tr key={record.id} className="border-b border-gray-200 hover:bg-gray-100">
                      <td className="py-3 px-6 text-left whitespace-nowrap">{new Date(record.date).toLocaleDateString()}</td>
                      <td className="py-3 px-6 text-left">{record.mileage}</td>
                      <td className="py-3 px-6 text-left">{getServiceNames(record.serviceId)}</td>
                      <td className="py-3 px-6 text-left">{record.provider}</td>
                      <td className="py-3 px-6 text-left">{record.amount.toFixed(2)} €</td>
                      <td className="py-3 px-6 text-left">{record.notes || '-'}</td>
                      <td className="py-3 px-6 text-left">
                        {record.invoicePdf ? (
                          <a href={base64ToBlobUrl(record.invoicePdf, 'application/pdf') || '#'} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                            <FileText size={18} />
                          </a>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td className="py-3 px-6 text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <button onClick={() => navigate(`/entretien/modifier/${record.id}`)} className="text-blue-500 hover:text-blue-700">
                            <Edit size={18} />
                          </button>
                          <button onClick={() => handleDeleteClick(record)} className="text-red-500 hover:text-red-700">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      <DeleteConfirmationModal
        open={isDeleteModalOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        itemName={recordToDelete ? `l'entretien du ${new Date(recordToDelete.date).toLocaleDateString()} pour ${getServiceNames(recordToDelete.serviceId)}` : ''}
      />
    </div>
  );
}
