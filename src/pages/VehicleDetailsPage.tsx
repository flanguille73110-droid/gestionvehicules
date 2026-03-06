import { useParams, Link } from 'react-router-dom';
import { useMyVehicles } from '../contexts/MyVehiclesContext';
import { useState, useEffect } from 'react';

export default function VehicleDetailsPage() {
  const { vehicleId } = useParams<{ vehicleId: string }>();
  const { myVehicles, updateMyVehicle } = useMyVehicles();
  const vehicle = myVehicles.find(v => v.id === vehicleId);

  const [localVehicle, setLocalVehicle] = useState(vehicle);
  const [isOperationModalOpen, setIsOperationModalOpen] = useState(false);
  const [editingOperationId, setEditingOperationId] = useState<string | null>(null);
  const [newOperation, setNewOperation] = useState({ operation: '', kmOrYear: '', plannedDate: '', price: '' });
  const [sortConfig, setSortConfig] = useState<{ key: 'operation' | 'plannedDate', direction: 'asc' | 'desc' } | null>({ key: 'operation', direction: 'asc' });

  useEffect(() => {
    setLocalVehicle(vehicle);
  }, [vehicle]);

  if (!vehicle || !localVehicle) {
    return (
      <div className="min-h-screen bg-violet-100 p-8">
        <div className="max-w-4xl mx-auto">
          <Link to="/vehicules" className="text-blue-500 hover:underline mb-4 inline-block">{'<'} Retour à la liste</Link>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <p className="text-red-500">Véhicule non trouvé.</p>
          </div>
        </div>
      </div>
    );
  }

  const handleFieldChange = (field: string, value: string) => {
    const updated = { ...localVehicle, [field]: value };
    setLocalVehicle(updated);
    updateMyVehicle(updated);
  };

  const handleSaveOperation = () => {
    if (!newOperation.operation) return;
    
    const currentPlan = localVehicle.maintenancePlan || [];
    let updatedPlan;

    if (editingOperationId) {
      updatedPlan = currentPlan.map(op => 
        op.id === editingOperationId ? { ...op, ...newOperation } : op
      );
    } else {
      const operationToAdd = {
        id: Date.now().toString(),
        ...newOperation
      };
      updatedPlan = [...currentPlan, operationToAdd];
    }

    const updated = { 
      ...localVehicle, 
      maintenancePlan: updatedPlan 
    };
    
    setLocalVehicle(updated);
    updateMyVehicle(updated);
    setIsOperationModalOpen(false);
    setNewOperation({ operation: '', kmOrYear: '', plannedDate: '', price: '' });
    setEditingOperationId(null);
  };

  const handleSort = (key: 'operation' | 'plannedDate') => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortedPlan = () => {
    const plan = [...(localVehicle.maintenancePlan || [])];
    if (!sortConfig) return plan;

    return plan.sort((a, b) => {
      if (sortConfig.key === 'operation') {
        return sortConfig.direction === 'asc' 
          ? a.operation.localeCompare(b.operation)
          : b.operation.localeCompare(a.operation);
      } else {
        const dateA = a.plannedDate || '';
        const dateB = b.plannedDate || '';
        return sortConfig.direction === 'asc'
          ? dateA.localeCompare(dateB)
          : dateB.localeCompare(dateA);
      }
    });
  };

  const sortedPlan = getSortedPlan();

  return (
    <div className="min-h-screen bg-violet-100 p-8">
      <div className="max-w-6xl mx-auto">
        <Link to="/vehicules" className="text-blue-500 hover:underline mb-4 inline-block">{'<'} Retour à la liste</Link>
        
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-white/20 backdrop-blur-sm">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-pink-600">
                {vehicle.brand} {vehicle.modelName}
              </h1>
              <p className="text-gray-500 font-medium mt-1">{vehicle.engine}</p>
              <button
                onClick={() => {
                  setEditingOperationId(null);
                  setNewOperation({ operation: '', kmOrYear: '', plannedDate: '', price: '' });
                  setIsOperationModalOpen(true);
                }}
                className="mt-4 bg-gradient-to-r from-blue-500 to-pink-500 hover:opacity-90 text-white px-4 py-2 rounded-lg shadow-md transition-all text-sm font-medium"
              >
                Ajouter une Opération
              </button>
            </div>
            
            <div className="flex flex-col gap-4">
              <div className="flex flex-col">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Immatriculation</label>
                <input 
                  type="text" 
                  value={localVehicle.licensePlate || ''} 
                  onChange={(e) => handleFieldChange('licensePlate', e.target.value)}
                  placeholder="AA-123-BB"
                  className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 font-mono text-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all shadow-sm"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Date 1 ère mise en circulation</label>
                <input 
                  type="date" 
                  value={localVehicle.firstRegistrationDate || ''} 
                  onChange={(e) => handleFieldChange('firstRegistrationDate', e.target.value)}
                  className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all shadow-sm"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Contrôle technique</label>
                <input 
                  type="date" 
                  value={localVehicle.nextCTDate || ''} 
                  onChange={(e) => handleFieldChange('nextCTDate', e.target.value)}
                  className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all shadow-sm"
                />
              </div>
            </div>
          </div>

          <div className="mt-10 overflow-hidden rounded-xl border border-gray-100 shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-gray-500 border-r border-gray-100">Taille Pneus</th>
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-gray-500 border-r border-gray-100">Essuis glace chauffeur</th>
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-gray-500 border-r border-gray-100">Essuis glace passager</th>
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-gray-500 border-r border-gray-100">Essuis glace arrière</th>
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-gray-500">réf huile</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-0 border-r border-gray-100">
                    <input 
                      type="text" 
                      value={localVehicle.tireSize || ''} 
                      onChange={(e) => handleFieldChange('tireSize', e.target.value)}
                      className="w-full px-4 py-4 focus:bg-blue-50/30 outline-none transition-colors"
                      placeholder="..."
                    />
                  </td>
                  <td className="p-0 border-r border-gray-100">
                    <input 
                      type="text" 
                      value={localVehicle.wiperDriver || ''} 
                      onChange={(e) => handleFieldChange('wiperDriver', e.target.value)}
                      className="w-full px-4 py-4 focus:bg-blue-50/30 outline-none transition-colors"
                      placeholder="..."
                    />
                  </td>
                  <td className="p-0 border-r border-gray-100">
                    <input 
                      type="text" 
                      value={localVehicle.wiperPassenger || ''} 
                      onChange={(e) => handleFieldChange('wiperPassenger', e.target.value)}
                      className="w-full px-4 py-4 focus:bg-blue-50/30 outline-none transition-colors"
                      placeholder="..."
                    />
                  </td>
                  <td className="p-0 border-r border-gray-100">
                    <input 
                      type="text" 
                      value={localVehicle.wiperRear || ''} 
                      onChange={(e) => handleFieldChange('wiperRear', e.target.value)}
                      className="w-full px-4 py-4 focus:bg-blue-50/30 outline-none transition-colors"
                      placeholder="..."
                    />
                  </td>
                  <td className="p-0">
                    <input 
                      type="text" 
                      value={localVehicle.oilRef || ''} 
                      onChange={(e) => handleFieldChange('oilRef', e.target.value)}
                      className="w-full px-4 py-4 focus:bg-blue-50/30 outline-none transition-colors"
                      placeholder="..."
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-8 bg-white p-8 rounded-2xl shadow-xl border border-white/20 backdrop-blur-sm">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Plan d'entretien</h2>
          <div className="overflow-hidden rounded-xl border border-gray-100 shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th 
                    className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-gray-500 border-r border-gray-100 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('operation')}
                  >
                    <div className="flex items-center justify-between">
                      <span>Opérations</span>
                      {sortConfig?.key === 'operation' && (
                        <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-gray-500 border-r border-gray-100">km et ou année</th>
                  <th 
                    className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-gray-500 border-r border-gray-100 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('plannedDate')}
                  >
                    <div className="flex items-center justify-between">
                      <span>Date prévus</span>
                      {sortConfig?.key === 'plannedDate' && (
                        <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-gray-500 border-r border-gray-100">Tarif approximatif</th>
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-gray-500 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedPlan.length > 0 ? (
                  sortedPlan.map((op) => (
                    <tr key={op.id} className="border-b border-gray-50 hover:bg-blue-50/30 transition-colors">
                      <td className="px-4 py-4 border-r border-gray-100">{op.operation}</td>
                      <td className="px-4 py-4 border-r border-gray-100">{op.kmOrYear}</td>
                      <td className="px-4 py-4 border-r border-gray-100">{op.plannedDate ? new Date(op.plannedDate).toLocaleDateString('fr-FR') : ''}</td>
                      <td className="px-4 py-4 border-r border-gray-100">{op.price ? `${op.price} €` : '-'}</td>
                      <td className="px-4 py-4 text-center">
                        <button
                          onClick={() => {
                            setEditingOperationId(op.id);
                            setNewOperation({ operation: op.operation, kmOrYear: op.kmOrYear, plannedDate: op.plannedDate, price: op.price || '' });
                            setIsOperationModalOpen(true);
                          }}
                          className="text-blue-500 hover:text-blue-700 font-medium text-sm bg-blue-50 px-3 py-1 rounded-md transition-colors"
                        >
                          Modifier
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                      Aucune opération prévue.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isOperationModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-xl font-bold mb-4">{editingOperationId ? 'Modifier l\'Opération' : 'Ajouter une Opération'}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Opération</label>
                <input
                  type="text"
                  value={newOperation.operation}
                  onChange={(e) => setNewOperation({ ...newOperation, operation: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Ex: Vidange"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Km et ou année</label>
                <input
                  type="text"
                  value={newOperation.kmOrYear}
                  onChange={(e) => setNewOperation({ ...newOperation, kmOrYear: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Ex: 15000 km ou 1 an"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date prévus</label>
                <input
                  type="date"
                  value={newOperation.plannedDate}
                  onChange={(e) => setNewOperation({ ...newOperation, plannedDate: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tarif approximatif (€)</label>
                <input
                  type="text"
                  value={newOperation.price}
                  onChange={(e) => setNewOperation({ ...newOperation, price: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Ex: 150"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setIsOperationModalOpen(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleSaveOperation}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
              >
                {editingOperationId ? 'Enregistrer' : 'Ajouter'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
