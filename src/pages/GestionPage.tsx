import { useState } from 'react';
import { useMaintenance } from '../contexts/MaintenanceContext';
import { useMyVehicles } from '../contexts/MyVehiclesContext';

export default function GestionPage() {
  const { maintenanceRecords } = useMaintenance();
  const { myVehicles } = useMyVehicles();
  const [selectedYear, setSelectedYear] = useState<string>('');

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 31 }, (_, i) => (currentYear - 10 + i).toString());

  const sortedRecords = [...maintenanceRecords].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const filteredRecords = selectedYear 
    ? sortedRecords.filter(record => new Date(record.date).getFullYear().toString() === selectedYear)
    : sortedRecords;

  const totalAmount = filteredRecords.reduce((sum, record) => sum + record.amount, 0);

  const getVehicleName = (vehicleId: string) => {
    const vehicle = myVehicles.find(v => v.id === vehicleId);
    return vehicle ? `${vehicle.brand} ${vehicle.modelName}` : 'Véhicule inconnu';
  };

  return (
    <div className="min-h-screen bg-violet-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-pink-600 mb-8">
          Gestion
        </h1>

        <div className="bg-white p-8 rounded-2xl shadow-xl border border-white/20">
          <div className="flex flex-wrap gap-6 mb-8 items-end">
            <div className="flex flex-col">
              <label htmlFor="year-filter" className="text-sm font-bold text-gray-600 mb-2 uppercase tracking-wider">Année</label>
              <div className="relative">
                <input
                  id="year-filter"
                  list="year-list"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  placeholder="Toutes les années"
                  className="w-48 px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-gray-50/50 shadow-inner transition-all"
                />
                <datalist id="year-list">
                  {years.map(year => <option key={year} value={year} />)}
                </datalist>
              </div>
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-bold text-gray-600 mb-2 uppercase tracking-wider">Total €</label>
              <div className="px-6 py-2.5 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 font-bold text-blue-700 shadow-sm min-w-[120px] text-center">
                {totalAmount.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
              </div>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-gray-500 border-r border-gray-100">Date</th>
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-gray-500 border-r border-gray-100">Véhicules</th>
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-gray-500">Prix</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.length > 0 ? (
                  filteredRecords.map(record => {
                    const dateObj = new Date(record.date);
                    return (
                      <tr key={record.id} className="border-b border-gray-50 hover:bg-blue-50/30 transition-colors">
                        <td className="px-4 py-4 border-r border-gray-100">{dateObj.toLocaleDateString('fr-FR')}</td>
                        <td className="px-4 py-4 border-r border-gray-100 font-medium text-gray-800">{getVehicleName(record.vehicleId)}</td>
                        <td className="px-4 py-4 font-medium text-gray-900">{record.amount.toFixed(2)} €</td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={3} className="px-4 py-8 text-center text-gray-500">
                      Aucune donnée disponible.
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
