import { Link } from 'react-router-dom';
import { useMyVehicles } from '../contexts/MyVehiclesContext';
import { useState, useMemo } from 'react';

export default function PlanningPage() {
  const { myVehicles } = useMyVehicles();
  const currentYear = new Date().getFullYear();
  
  const [selectedYear, setSelectedYear] = useState(currentYear.toString());
  const [selectedVehicleId, setSelectedVehicleId] = useState('all');

  const years = useMemo(() => {
    const range = [];
    for (let i = currentYear - 5; i <= currentYear + 5; i++) {
      range.push(i.toString());
    }
    return range;
  }, [currentYear]);

  const allPlannedPrograms = useMemo(() => {
    let programs: any[] = [];
    myVehicles.forEach(vehicle => {
      if (selectedVehicleId === 'all' || vehicle.id === selectedVehicleId) {
        const vehiclePrograms = (vehicle.plannedPrograms || []).map(p => ({
          ...p,
          vehicleName: `${vehicle.brand} ${vehicle.modelName}`,
          vehicleId: vehicle.id
        }));
        programs = [...programs, ...vehiclePrograms];
      }
    });
    
    return programs
      .filter(p => {
        if (!p.plannedDate) return false;
        const year = new Date(p.plannedDate).getFullYear().toString();
        return year === selectedYear;
      })
      .sort((a, b) => new Date(a.plannedDate).getTime() - new Date(b.plannedDate).getTime());
  }, [myVehicles, selectedYear, selectedVehicleId]);

  const totalAmount = useMemo(() => {
    return allPlannedPrograms.reduce((sum, p) => sum + (parseFloat(p.price || '0') || 0), 0);
  }, [allPlannedPrograms]);

  return (
    <div className="min-h-screen bg-violet-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-pink-600 mb-8">
          Planning
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {[...myVehicles].sort((a, b) => `${a.brand} ${a.modelName}`.localeCompare(`${b.brand} ${b.modelName}`)).map(vehicle => (
            <Link 
              key={vehicle.id} 
              to={`/planning/${vehicle.id}`}
              className="bg-gradient-to-br from-blue-500 to-pink-500 rounded-2xl p-6 shadow-md hover:shadow-xl transform transition-all hover:scale-[1.02] border border-white/20 text-white"
            >
              <h2 className="text-xl font-bold mb-2">
                {vehicle.brand} {vehicle.modelName}
              </h2>
              <p className="font-mono bg-white/20 inline-block px-3 py-1 rounded-lg">
                {vehicle.licensePlate || 'Sans immatriculation'}
              </p>
            </Link>
          ))}
          
          {myVehicles.length === 0 && (
            <div className="col-span-full text-center text-gray-500 bg-white p-8 rounded-2xl shadow-sm">
              <p>Aucun véhicule enregistré.</p>
            </div>
          )}
        </div>

        {/* Filters Section */}
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-white/20 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-gray-600 uppercase tracking-wider">Année</label>
              <select 
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 font-medium"
              >
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-gray-600 uppercase tracking-wider">Véhicule</label>
              <select 
                value={selectedVehicleId}
                onChange={(e) => setSelectedVehicleId(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 font-medium"
              >
                <option value="all">Tous les véhicules</option>
                {myVehicles.map(v => (
                  <option key={v.id} value={v.id}>{v.brand} {v.modelName} ({v.licensePlate || 'Sans immat.'})</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-gray-600 uppercase tracking-wider">Montant des prestations ({selectedYear})</label>
              <div className="w-full bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 font-mono font-bold text-blue-600 text-xl flex items-center justify-center shadow-inner">
                {totalAmount.toLocaleString('fr-FR')} €
              </div>
            </div>
          </div>
        </div>

        {/* Summary Table */}
        <div className="bg-white rounded-2xl shadow-xl border border-white/20 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gray-50/50">
            <h2 className="text-xl font-bold text-gray-800">Récapitulatif des opérations prévues</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 border-r border-gray-100">Date prévus</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 border-r border-gray-100">Km prévus</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 border-r border-gray-100">Opérations</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Tarifs</th>
                </tr>
              </thead>
              <tbody>
                {allPlannedPrograms.length > 0 ? (
                  allPlannedPrograms.map(program => (
                    <tr key={program.id} className="border-b border-gray-50 hover:bg-blue-50/30 transition-colors">
                      <td className="px-6 py-4 border-r border-gray-100 text-sm">
                        {program.plannedDate ? new Date(program.plannedDate).toLocaleDateString('fr-FR') : '-'}
                      </td>
                      <td className="px-6 py-4 border-r border-gray-100 text-sm">
                        {program.plannedKm ? `${parseInt(program.plannedKm).toLocaleString('fr-FR')} km` : '-'}
                      </td>
                      <td className="px-6 py-4 border-r border-gray-100">
                        <div className="font-medium text-gray-900">{program.operationName}</div>
                        {selectedVehicleId === 'all' && (
                          <div className="text-xs text-gray-500 mt-0.5">{program.vehicleName}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 font-bold text-blue-600">
                        {program.price ? `${parseFloat(program.price).toLocaleString('fr-FR')} €` : '-'}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500 italic">
                      Aucune opération prévue pour cette sélection.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
