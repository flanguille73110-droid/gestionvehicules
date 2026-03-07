import { Link } from 'react-router-dom';

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-violet-100 p-8">
      <div className="max-w-4xl mx-auto">
        <Link to="/" className="text-blue-500 hover:underline mb-4 inline-block">{'<'} Retour à l'accueil</Link>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Paramètres</h1>
          <div className="space-y-4">
            <Link to="/params/prestations" className="block bg-gradient-to-r from-blue-500 to-pink-500 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:from-blue-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105">
              Liste Prestations
            </Link>
            <Link to="/params/marques-modeles" className="block bg-gradient-to-r from-blue-500 to-pink-500 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:from-blue-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105">
              Marques et Modèles
            </Link>
            <Link to="/params/sauvegarde-import" className="block bg-gradient-to-r from-blue-500 to-pink-500 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:from-blue-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105">
              Sauvegarde & Import / Réinitialisation
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
