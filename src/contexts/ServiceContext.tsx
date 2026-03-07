import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Service } from '../types';

const predefinedServices: Omit<Service, 'id'>[] = [
  // Révisions et entretien
  { name: 'Révision complète' },
  { name: 'Vidange et remplacement du filtre à huile' },
  { name: 'Remplacement du filtre à air' },
  { name: 'Remplacement du filtre à carburant' },
  { name: 'Remplacement du filtre d\'habitacle' },
  { name: 'Remplacement des bougies d\'allumage' },
  { name: 'Contrôle et mise à niveau des fluides' },

  // Freinage
  { name: 'Remplacement des plaquettes de frein avant' },
  { name: 'Remplacement des plaquettes de frein arrière' },
  { name: 'Remplacement des disques de frein avant' },
  { name: 'Remplacement des disques de frein arrière' },
  { name: 'Purge du liquide de frein' },

  // Pneus et roues
  { name: 'Remplacement de pneu' },
  { name: 'Équilibrage des roues' },
  { name: 'Parallélisme (géométrie)' },
  { name: 'Permutation des pneus' },

  // Moteur et distribution
  { name: 'Remplacement du kit de distribution' },
  { name: 'Remplacement de la courroie d\'accessoires' },
  { name: 'Diagnostic moteur (valise)' },

  // Climatisation
  { name: 'Recharge de la climatisation' },
  { name: 'Nettoyage du circuit de climatisation' },

  // Visibilité
  { name: 'Remplacement des balais d\'essuie-glace' },
  { name: 'Remplacement d\'ampoule de phare' },

  // Autres
  { name: 'Contrôle technique' },
  { name: 'Lavage intérieur/extérieur' },
];

const initialServices: Service[] = predefinedServices.map(service => ({
  ...service,
  id: service.name, // Use the name as a stable ID for predefined services
}));

interface ServiceContextType {
  services: Service[];
  addService: (service: Omit<Service, 'id'> & { id?: string }) => string;
  updateService: (service: Service) => void;
  deleteService: (id: string) => void;
}

const ServiceContext = createContext<ServiceContextType | undefined>(undefined);

const STORAGE_KEY = 'autosuivi_services';

export function ServiceProvider({ children }: { children: ReactNode }) {
  const [services, setServices] = useState<Service[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Ensure predefined services are always present with their stable IDs
      const existingIds = new Set(parsed.map((s: Service) => s.id));
      const missingPredefined = initialServices.filter(s => !existingIds.has(s.id));
      return [...parsed, ...missingPredefined];
    }
    return initialServices;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(services));
  }, [services]);

  const addService = (service: Omit<Service, 'id'> & { id?: string }) => {
    const newId = service.id || crypto.randomUUID();
    const newService = { ...service, id: newId };
    
    setServices(prevServices => {
      // If the ID already exists, don't add it again
      if (prevServices.some(s => s.id === newId)) {
        return prevServices;
      }
      
      // If the name already exists but with a different ID, we still add it 
      // to support imported records that might use this specific ID.
      // This prevents the "numbers/chiffres" issue in the carnet d'entretien.
      return [...prevServices, newService];
    });
    return newId;
  };

  const updateService = (updatedService: Service) => {
    setServices(prevServices =>
      prevServices.map(s => (s.id === updatedService.id ? updatedService : s))
    );
  };

  const deleteService = (id: string) => {
    setServices(prevServices => prevServices.filter(s => s.id !== id));
  };

  return (
    <ServiceContext.Provider value={{ services, addService, updateService, deleteService }}>
      {children}
    </ServiceContext.Provider>
  );
}

export function useServices() {
  const context = useContext(ServiceContext);
  if (context === undefined) {
    throw new Error('useServices must be used within a ServiceProvider');
  }
  return context;
}
