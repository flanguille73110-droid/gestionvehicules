import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useMyVehicles } from '../contexts/MyVehiclesContext';
import { useServices } from '../contexts/ServiceContext';
import { useMaintenance } from '../contexts/MaintenanceContext';

export default function AddMaintenanceRecordPage() {
  const { vehicleId: urlVehicleId } = useParams<{ vehicleId: string }>();
  const navigate = useNavigate();
  const { myVehicles } = useMyVehicles();
  const { services } = useServices();
  const { addMaintenanceRecord } = useMaintenance();

  const sortedServices = useMemo(() => {
    return [...services].sort((a, b) => a.name.localeCompare(b.name));
  }, [services]);

  const [vehicleId, setVehicleId] = useState(urlVehicleId || '');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [mileage, setMileage] = useState('');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [provider, setProvider] = useState('');
  const [amount, setAmount] = useState('');
  const [invoicePdf, setInvoicePdf] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (urlVehicleId) {
      setVehicleId(urlVehicleId);
    } else if (myVehicles.length > 0) {
      setVehicleId(myVehicles[0].id);
    }
  }, [urlVehicleId, myVehicles]);

  const handleServiceChange = (serviceId: string) => {
    setSelectedServices(prev =>
      prev.includes(serviceId) ? prev.filter(id => id !== serviceId) : [...prev, serviceId]
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      const reader = new FileReader();
      reader.onloadend = () => {
        setInvoicePdf(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setInvoicePdf(undefined);
      alert('Veuillez sélectionner un fichier PDF.');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (vehicleId && selectedServices.length > 0 && date && mileage && provider && amount) {
      addMaintenanceRecord({
        vehicleId,
        serviceId: selectedServices.join(', '),
        date,
        mileage: parseInt(mileage),
        notes,
        provider,
        amount: parseFloat(amount),
        invoicePdf, // Inclure le PDF encodé
      });
      navigate(`/entretien/details/${vehicleId}`);
    }
  };

  const currentVehicle = myVehicles.find(v => v.id === vehicleId);

  return (
    <div className="min-h-screen bg-violet-100 p-8">
      <div className="max-w-lg mx-auto">
        <Link to={vehicleId ? `/entretien/details/${vehicleId}` : "/entretien"} className="text-blue-500 hover:underline mb-4 inline-block">{'<'} Retour</Link>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Ajouter un entretien</h1>
          {currentVehicle && (
            <p className="text-lg text-gray-700 mb-4">Pour: {currentVehicle.brand} {currentVehicle.modelName} ({currentVehicle.engine})</p>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
              <input type="date" id="date" value={date} onChange={(e) => setDate(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" required />
            </div>
            <div>
              <label htmlFor="mileage" className="block text-sm font-medium text-gray-700">Kilométrage (KM)</label>
              <input type="number" id="mileage" value={mileage} onChange={(e) => setMileage(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Prestation(s)</label>
              <div className="mt-1 border border-gray-300 rounded-md shadow-sm p-3 max-h-40 overflow-y-auto">
                {sortedServices.map(s => (
                  <div key={s.id} className="flex items-center">
                    <input type="checkbox" id={`service-${s.id}`} checked={selectedServices.includes(s.id)} onChange={() => handleServiceChange(s.id)} className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                    <label htmlFor={`service-${s.id}`} className="ml-2 block text-sm text-gray-900">{s.name}</label>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <label htmlFor="provider" className="block text-sm font-medium text-gray-700">Prestataire</label>
              <input type="text" id="provider" value={provider} onChange={(e) => setProvider(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" required />
            </div>
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Montant facture (€)</label>
              <input type="number" id="amount" value={amount} onChange={(e) => setAmount(e.target.value)} step="0.01" className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" required />
            </div>
            <div>
              <label htmlFor="invoicePdf" className="block text-sm font-medium text-gray-700">Facture (PDF optionnel)</label>
              <input type="file" id="invoicePdf" accept=".pdf" onChange={handleFileChange} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
            </div>
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Observation (optionnel)</label>
              <textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"></textarea>
            </div>
            <button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-pink-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:from-blue-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105">
              Enregistrer l'entretien
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
