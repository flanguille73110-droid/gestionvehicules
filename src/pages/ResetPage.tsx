import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, AlertTriangle, X } from 'lucide-react';

export default function ResetPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleReset = () => {
    localStorage.clear();
    // Force a full reload to reset all contexts
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-violet-100 p-8">
      <div className="max-w-4xl mx-auto">
        <Link to="/params" className="text-blue-500 hover:underline mb-4 inline-block">{'<'} Retour aux paramètres</Link>
        
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-white/20">
          {/* Tabs */}
          <div className="flex border-b border-gray-100 bg-gray-50/50">
            <Link 
              to="/params/sauvegarde-import"
              className="px-8 py-4 text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors border-r border-gray-100"
            >
              Sauvegarde & Import
            </Link>
            <div className="px-8 py-4 text-sm font-bold text-blue-600 bg-white border-b-2 border-blue-600">
              Réinitialisation
            </div>
          </div>

          <div className="p-8">
            <div className="flex items-center space-x-4 mb-6">
              <div className="p-3 bg-orange-100 rounded-xl">
                <AlertTriangle className="text-orange-600" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Réinitialisation de l'application</h1>
                <p className="text-gray-500">Effacez toutes vos données personnelles et recommencez à zéro.</p>
              </div>
            </div>

            <div className="bg-orange-50 border border-orange-100 rounded-xl p-6 mb-8">
              <h3 className="font-bold text-orange-800 mb-2">Attention !</h3>
              <p className="text-orange-700 text-sm leading-relaxed">
                Cette action est irréversible. Toutes vos données (véhicules, entretiens, prestations personnalisées) seront définitivement supprimées de votre navigateur. 
                Nous vous conseillons d'effectuer une sauvegarde avant de procéder.
              </p>
            </div>

            <button 
              onClick={() => setIsModalOpen(true)}
              className="w-full bg-gradient-to-r from-red-600 to-orange-500 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:from-red-700 hover:to-orange-600 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center space-x-3"
            >
              <Trash2 size={20} />
              <span>Réinitialiser l'application</span>
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-800">Confirmer la réinitialisation</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={24} />
              </button>
            </div>
            <div className="p-8 text-center">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trash2 className="text-red-600" size={40} />
              </div>
              <p className="text-gray-600 mb-2 font-medium">Êtes-vous absolument sûr ?</p>
              <p className="text-gray-500 text-sm">
                Toutes vos données seront perdues. Cette action ne peut pas être annulée.
              </p>
            </div>
            <div className="p-6 bg-gray-50 flex space-x-4">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="flex-1 px-6 py-3 rounded-xl border border-gray-200 font-bold text-gray-600 hover:bg-white transition-colors"
              >
                Annuler
              </button>
              <button 
                onClick={handleReset}
                className="flex-1 px-6 py-3 rounded-xl bg-red-600 font-bold text-white hover:bg-red-700 shadow-md transition-colors"
              >
                Réinitialiser
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
