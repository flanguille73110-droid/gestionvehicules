import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useServices } from '../contexts/ServiceContext';

export default function AddServicePage() {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const { addService } = useServices();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name) {
      addService({ name, price });
      navigate('/params/prestations');
    }
  };

  return (
    <div className="min-h-screen bg-violet-100 p-8">
      <div className="max-w-lg mx-auto">
        <Link to="/params/prestations" className="text-blue-500 hover:underline mb-4 inline-block">{'<'} Retour à la liste</Link>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Ajouter une nouvelle prestation</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nom de la prestation</label>
              <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" required />
            </div>
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">Tarif approximatif (€)</label>
              <input type="text" id="price" value={price} onChange={(e) => setPrice(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="Ex: 150" />
            </div>
            <button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-pink-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:from-blue-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105">
              Enregistrer la prestation
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
