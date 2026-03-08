import { useParams, Link } from 'react-router-dom';
import { useMyVehicles } from '../contexts/MyVehiclesContext';
import { useState } from 'react';
import { ArrowUpDown, Pencil, Trash2 } from 'lucide-react';

export default function PlanningVehiclePage() {
  const { vehicleId } = useParams<{ vehicleId: string }>();
  const { myVehicles, updateMyVehicle } = useMyVehicles();
  const vehicle = myVehicles.find(v => v.id === vehicleId);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [idToDelete, setIdToDelete] = useState<string | null>(null);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isBulkEditModalOpen, setIsBulkEditModalOpen] = useState(false);
  const [bulkPrice, setBulkPrice] = useState('');
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);

  const [newProgram, setNewProgram] = useState({ operationName: '', kmOrYear: '', plannedDate: '', plannedKm: '', price: '' });
  const [repetitionYears, setRepetitionYears] = useState('');
  const [untilYear, setUntilYear] = useState('');
  const [frequencyKm, setFrequencyKm] = useState('');
  
  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>({ key: 'operationName', direction: 'asc' });
  const [selectedYear, setSelectedYear] = useState<string>('');

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 31 }, (_, i) => (currentYear - 10 + i).toString());

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-violet-100 p-8">
        <div className="max-w-4xl mx-auto text-center">
          <Link to="/planning" className="text-blue-500 hover:underline mb-4 inline-block">{'<'} Retour au planning</Link>
          <p className="text-red-500 bg-white p-6 rounded-lg shadow-md">Véhicule non trouvé.</p>
        </div>
      </div>
    );
  }

  const handleOperationSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOpName = e.target.value;
    const selectedOp = vehicle.maintenancePlan?.find(op => op.operation === selectedOpName);
    
    setNewProgram({
      ...newProgram,
      operationName: selectedOpName,
      kmOrYear: selectedOp ? selectedOp.kmOrYear : '',
      price: selectedOp?.price || ''
    });
  };

  const handleEditClick = (program: any) => {
    setNewProgram({
      operationName: program.operationName,
      kmOrYear: program.kmOrYear,
      plannedDate: program.plannedDate,
      plannedKm: program.plannedKm,
      price: program.price
    });
    setEditingId(program.id);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setIdToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (!idToDelete || !vehicle) return;
    const updatedVehicle = {
      ...vehicle,
      plannedPrograms: (vehicle.plannedPrograms || []).filter(p => p.id !== idToDelete)
    };
    updateMyVehicle(updatedVehicle);
    setIsDeleteModalOpen(false);
    setIdToDelete(null);
  };

  const handleAddProgram = () => {
    if (!newProgram.operationName) return;

    const currentPrograms = vehicle.plannedPrograms || [];

    if (isEditMode && editingId) {
      const updatedPrograms = currentPrograms.map(p => 
        p.id === editingId ? { ...p, ...newProgram } : p
      );
      updateMyVehicle({ ...vehicle, plannedPrograms: updatedPrograms });
      setIsModalOpen(false);
      setIsEditMode(false);
      setEditingId(null);
      setNewProgram({ operationName: '', kmOrYear: '', plannedDate: '', plannedKm: '', price: '' });
      return;
    }

    let programsToAdd = [];

    const repYears = parseInt(repetitionYears);
    const endYear = parseInt(untilYear);
    const startKm = parseInt(newProgram.plannedKm);
    const freqKm = parseInt(frequencyKm);

    if (newProgram.plannedDate && !isNaN(repYears) && repYears > 0 && !isNaN(endYear)) {
      let currentDate = new Date(newProgram.plannedDate);
      let currentYear = currentDate.getFullYear();
      let iteration = 0;

      while (currentYear <= endYear) {
        let calculatedKm = newProgram.plannedKm;
        if (!isNaN(startKm) && !isNaN(freqKm)) {
          calculatedKm = (startKm + (iteration * freqKm)).toString();
        }

        programsToAdd.push({
          id: Date.now().toString() + '-' + iteration,
          operationName: newProgram.operationName,
          kmOrYear: newProgram.kmOrYear,
          // Format YYYY-MM-DD
          plannedDate: currentDate.toISOString().split('T')[0],
          plannedKm: calculatedKm,
          price: newProgram.price
        });

        currentDate.setFullYear(currentDate.getFullYear() + repYears);
        currentYear = currentDate.getFullYear();
        iteration++;
      }
    } else {
      programsToAdd.push({
        id: Date.now().toString(),
        ...newProgram
      });
    }

    const updatedVehicle = {
      ...vehicle,
      plannedPrograms: [...currentPrograms, ...programsToAdd]
    };

    updateMyVehicle(updatedVehicle);
    setIsModalOpen(false);
    setIsEditMode(false);
    setEditingId(null);
    setNewProgram({ operationName: '', kmOrYear: '', plannedDate: '', plannedKm: '', price: '' });
    setRepetitionYears('');
    setUntilYear('');
    setFrequencyKm('');
  };

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedPrograms = [...(vehicle.plannedPrograms || [])].sort((a, b) => {
    if (!sortConfig) return 0;

    const { key, direction } = sortConfig;
    
    if (key === 'plannedDate') {
      const dateA = new Date(a.plannedDate).getTime();
      const dateB = new Date(b.plannedDate).getTime();
      return direction === 'asc' ? dateA - dateB : dateB - dateA;
    }
    
    if (key === 'plannedKm') {
      const kmA = parseInt(a.plannedKm) || 0;
      const kmB = parseInt(b.plannedKm) || 0;
      return direction === 'asc' ? kmA - kmB : kmB - kmA;
    }
    
    if (key === 'operationName') {
      return direction === 'asc' 
        ? a.operationName.localeCompare(b.operationName)
        : b.operationName.localeCompare(a.operationName);
    }

    if (key === 'price') {
      const priceA = parseFloat(a.price || '0') || 0;
      const priceB = parseFloat(b.price || '0') || 0;
      return direction === 'asc' ? priceA - priceB : priceB - priceA;
    }
    
    return 0;
  });

  const filteredPrograms = selectedYear 
    ? sortedPrograms.filter(p => p.plannedDate && new Date(p.plannedDate).getFullYear().toString() === selectedYear)
    : sortedPrograms;

  const totalAmount = filteredPrograms.reduce((sum, p) => {
    const price = parseFloat(p.price || '0') || 0;
    return sum + price;
  }, 0);

  const selectedPrograms = (vehicle.plannedPrograms || []).filter(p => selectedIds.includes(p.id));
  const canBulkEdit = selectedPrograms.length > 0 && selectedPrograms.every(p => p.operationName === selectedPrograms[0].operationName);
  const canBulkDelete = selectedIds.length > 0;

  const toggleSelection = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = () => {
    if (!vehicle) return;
    const updatedVehicle = {
      ...vehicle,
      plannedPrograms: (vehicle.plannedPrograms || []).filter(p => !selectedIds.includes(p.id))
    };
    updateMyVehicle(updatedVehicle);
    setSelectedIds([]);
    setIsBulkDeleteModalOpen(false);
  };

  const handleBulkEdit = () => {
    if (!vehicle) return;
    const updatedPrograms = (vehicle.plannedPrograms || []).map(p => 
      selectedIds.includes(p.id) ? { ...p, price: bulkPrice } : p
    );
    updateMyVehicle({ ...vehicle, plannedPrograms: updatedPrograms });
    setSelectedIds([]);
    setIsBulkEditModalOpen(false);
    setBulkPrice('');
  };

  return (
    <div className="min-h-screen bg-violet-100 p-8">
      <div className="max-w-6xl mx-auto">
        <Link to="/planning" className="text-blue-500 hover:underline mb-4 inline-block">{'<'} Retour au planning</Link>
        
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-white/20">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-pink-600">
              Plan d'entretien - {vehicle.brand} {vehicle.modelName}
            </h1>
            <button
              onClick={() => {
                setIsEditMode(false);
                setEditingId(null);
                setNewProgram({ operationName: '', kmOrYear: '', plannedDate: '', plannedKm: '', price: '' });
                setIsModalOpen(true);
              }}
              className="bg-gradient-to-r from-blue-500 to-pink-500 hover:opacity-90 text-white px-4 py-2 rounded-lg shadow-md transition-all text-sm font-medium"
            >
              Ajouter un programme
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-6 mb-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
            <div className="flex items-center gap-3">
              <label htmlFor="year-filter" className="text-sm font-bold text-gray-700 uppercase tracking-wider text-gray-600">Année :</label>
              <div className="relative">
                <input
                  list="years-list"
                  id="year-filter"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  placeholder="Toutes"
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none w-32 bg-white text-sm"
                />
                <datalist id="years-list">
                  {years.map(year => (
                    <option key={year} value={year} />
                  ))}
                </datalist>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <label className="text-sm font-bold text-gray-700 uppercase tracking-wider text-gray-600">Total € :</label>
              <div className="bg-white border border-gray-300 rounded-lg px-4 py-2 font-mono font-bold text-blue-600 min-w-[100px] text-center shadow-sm">
                {totalAmount.toLocaleString('fr-FR')} €
              </div>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-gray-500 border-r border-gray-100 w-24">
                    <div className="flex flex-col items-center gap-2">
                      <span>Sélection</span>
                      <div className="flex items-center gap-2">
                        {canBulkEdit && (
                          <button 
                            onClick={() => {
                              setBulkPrice(selectedPrograms[0].price || '');
                              setIsBulkEditModalOpen(true);
                            }}
                            className="p-1 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                            title="Modifier les tarifs"
                          >
                            <Pencil size={14} />
                          </button>
                        )}
                        {canBulkDelete && (
                          <button 
                            onClick={() => setIsBulkDeleteModalOpen(true)}
                            className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                            title="Supprimer la sélection"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                  </th>
                  <th 
                    className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-gray-500 border-r border-gray-100 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('plannedDate')}
                  >
                    <div className="flex items-center gap-2">
                      Date prévus
                      <ArrowUpDown size={14} />
                    </div>
                  </th>
                  <th 
                    className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-gray-500 border-r border-gray-100 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('plannedKm')}
                  >
                    <div className="flex items-center gap-2">
                      Km prévus
                      <ArrowUpDown size={14} />
                    </div>
                  </th>
                  <th 
                    className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-gray-500 cursor-pointer hover:bg-gray-100 transition-colors border-r border-gray-100"
                    onClick={() => handleSort('operationName')}
                  >
                    <div className="flex items-center gap-2">
                      Opérations
                      <ArrowUpDown size={14} />
                    </div>
                  </th>
                  <th 
                    className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-gray-500 cursor-pointer hover:bg-gray-100 transition-colors border-r border-gray-100"
                    onClick={() => handleSort('price')}
                  >
                    <div className="flex items-center gap-2">
                      Tarifs
                      <ArrowUpDown size={14} />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredPrograms.length > 0 ? (
                  filteredPrograms.map(program => (
                    <tr key={program.id} className={`border-b border-gray-50 hover:bg-blue-50/30 transition-colors ${selectedIds.includes(program.id) ? 'bg-green-50/50' : ''}`}>
                      <td className="px-4 py-4 border-r border-gray-100 text-center">
                        <button
                          onClick={() => toggleSelection(program.id)}
                          className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${
                            selectedIds.includes(program.id) 
                              ? 'bg-green-500 border-green-500 text-white' 
                              : 'border-gray-300 hover:border-green-500'
                          }`}
                        >
                          {selectedIds.includes(program.id) && (
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </button>
                      </td>
                      <td className="px-4 py-4 border-r border-gray-100 text-sm">
                        {program.plannedDate ? new Date(program.plannedDate).toLocaleDateString('fr-FR') : ''}
                      </td>
                      <td className="px-4 py-4 border-r border-gray-100 text-sm">
                        {program.plannedKm ? `${parseInt(program.plannedKm).toLocaleString('fr-FR')} km` : ''}
                      </td>
                      <td className="px-4 py-4 font-medium text-gray-900 border-r border-gray-100 text-sm">
                        {program.operationName}
                      </td>
                      <td className="px-4 py-4 font-medium text-gray-900 border-r border-gray-100 text-sm">
                        {program.price ? `${program.price} €` : '-'}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEditClick(program)}
                            className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                            title="Modifier"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(program.id)}
                            className="p-1.5 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                            title="Supprimer"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                      Aucun programme prévu.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-xl font-bold mb-4">
              {isEditMode ? 'Modifier le programme' : 'Ajouter un programme'}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Opération</label>
                <select
                  value={newProgram.operationName}
                  onChange={handleOperationSelect}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="">Sélectionner une opération</option>
                  {[...(vehicle.maintenancePlan || [])]
                    .sort((a, b) => a.operation.localeCompare(b.operation))
                    .map(op => {
                      const isAlreadyPlanned = vehicle.plannedPrograms?.some(p => p.operationName === op.operation);
                      return (
                        <option 
                          key={op.id} 
                          value={op.operation}
                          style={{ color: isAlreadyPlanned ? '#9ca3af' : 'inherit' }}
                        >
                          {op.operation} {isAlreadyPlanned ? '(Déjà programmé)' : ''}
                        </option>
                      );
                    })}
                </select>
              </div>
              
              {newProgram.operationName && (
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">Fréquence recommandée :</span> {newProgram.kmOrYear || 'Non spécifiée'}
                  </p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date prévus</label>
                <input
                  type="date"
                  value={newProgram.plannedDate}
                  onChange={(e) => setNewProgram({ ...newProgram, plannedDate: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              {!isEditMode && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Répétitions (années)</label>
                    <input
                      type="number"
                      value={repetitionYears}
                      onChange={(e) => setRepetitionYears(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="Ex: 1"
                      min="1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Jusqu'en (année)</label>
                    <input
                      type="number"
                      value={untilYear}
                      onChange={(e) => setUntilYear(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="Ex: 2050"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Km de départ</label>
                <input
                  type="number"
                  value={newProgram.plannedKm}
                  onChange={(e) => setNewProgram({ ...newProgram, plannedKm: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Ex: 125000"
                />
              </div>
              {!isEditMode && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fréquence Km</label>
                  <input
                    type="number"
                    value={frequencyKm}
                    onChange={(e) => setFrequencyKm(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Ex: 30000"
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tarifs (€)</label>
                <input
                  type="text"
                  value={newProgram.price}
                  onChange={(e) => setNewProgram({ ...newProgram, price: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Ex: 150"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setIsEditMode(false);
                  setEditingId(null);
                }}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleAddProgram}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
              >
                {isEditMode ? 'Enregistrer' : 'Ajouter'}
              </button>
            </div>
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <h3 className="text-xl font-bold mb-2 text-gray-900">Confirmer la suppression</h3>
            <p className="text-gray-600 mb-6">
              Êtes-vous sûr de vouloir supprimer cette ligne du planning ? Cette action est irréversible.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {isBulkEditModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[70] p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-xl font-bold mb-4">Modifier les tarifs ({selectedIds.length} lignes)</h3>
            <p className="text-sm text-gray-600 mb-4">
              Opération : <span className="font-bold">{selectedPrograms[0]?.operationName}</span>
            </p>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nouveau tarif (€)</label>
              <input
                type="text"
                value={bulkPrice}
                onChange={(e) => setBulkPrice(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Ex: 150"
              />
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setIsBulkEditModalOpen(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleBulkEdit}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
              >
                Appliquer
              </button>
            </div>
          </div>
        </div>
      )}

      {isBulkDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[70] p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <h3 className="text-xl font-bold mb-2 text-gray-900">Confirmer la suppression groupée</h3>
            <p className="text-gray-600 mb-6">
              Êtes-vous sûr de vouloir supprimer les {selectedIds.length} lignes sélectionnées ? Cette action est irréversible.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsBulkDeleteModalOpen(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleBulkDelete}
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
