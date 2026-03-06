import { createContext, useContext, useState, ReactNode } from 'react';
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
  id: crypto.randomUUID(),
}));

interface ServiceContextType {
  services: Service[];
  addService: (service: Omit<Service, 'id'> & { id?: string }) => string;
  updateService: (service: Service) => void;
  deleteService: (id: string) => void;
}

const ServiceContext = createContext<ServiceContextType | undefined>(undefined);

export function ServiceProvider({ children }: { children: ReactNode }) {
  const [services, setServices] = useState<Service[]>(initialServices);

  const addService = (service: Omit<Service, 'id'> & { id?: string }) => {
    const newId = service.id || crypto.randomUUID();
    const newService = { ...service, id: newId };
    setServices(prevServices => {
      // Check for duplicates by ID
      if (prevServices.some(s => s.id === newId)) {
        return prevServices;
      }
      // Check for duplicates by name (case insensitive)
      if (prevServices.some(s => s.name.toLowerCase().trim() === newService.name.toLowerCase().trim())) {
        return prevServices;
      }
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
