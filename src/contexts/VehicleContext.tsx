import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Vehicle } from '../types';

interface VehicleContextType {
  vehicles: Vehicle[];
  addVehicle: (vehicle: Omit<Vehicle, 'id'>) => void;
}

const VehicleContext = createContext<VehicleContextType | undefined>(undefined);

const STORAGE_KEY = 'autosuivi_vehicles';

export function VehicleProvider({ children }: { children: ReactNode }) {
  const [vehicles, setVehicles] = useState<Vehicle[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(vehicles));
  }, [vehicles]);

  const addVehicle = (vehicle: Omit<Vehicle, 'id'>) => {
    const newVehicle = { ...vehicle, id: crypto.randomUUID() };
    setVehicles(prevVehicles => [...prevVehicles, newVehicle]);
  };

  return (
    <VehicleContext.Provider value={{ vehicles, addVehicle }}>
      {children}
    </VehicleContext.Provider>
  );
}

export function useVehicles() {
  const context = useContext(VehicleContext);
  if (context === undefined) {
    throw new Error('useVehicles must be used within a VehicleProvider');
  }
  return context;
}
