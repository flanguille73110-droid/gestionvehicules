import { createContext, useContext, useState, ReactNode } from 'react';
import { VehicleModel } from '../types';

interface MyVehiclesContextType {
  myVehicles: VehicleModel[];
  addMyVehicle: (vehicle: Omit<VehicleModel, 'id'> & { id?: string }) => string;
  updateMyVehicle: (updatedVehicle: VehicleModel) => void;
  deleteMyVehicle: (vehicleId: string) => void;
}

const MyVehiclesContext = createContext<MyVehiclesContextType | undefined>(undefined);

export function MyVehiclesProvider({ children }: { children: ReactNode }) {
  const [myVehicles, setMyVehicles] = useState<VehicleModel[]>([]);

  const addMyVehicle = (vehicle: Omit<VehicleModel, 'id'> & { id?: string }) => {
    const newId = vehicle.id || crypto.randomUUID();
    const newVehicle = { ...vehicle, id: newId };
    setMyVehicles(prevVehicles => {
      // Check for duplicates by ID to prevent adding the same vehicle twice during import
      if (prevVehicles.some(v => v.id === newId)) {
        return prevVehicles;
      }
      return [...prevVehicles, newVehicle];
    });
    return newId;
  };

  const updateMyVehicle = (updatedVehicle: VehicleModel) => {
    setMyVehicles(prevVehicles =>
      prevVehicles.map(vehicle =>
        vehicle.id === updatedVehicle.id ? updatedVehicle : vehicle
      )
    );
  };

  const deleteMyVehicle = (vehicleId: string) => {
    setMyVehicles(prevVehicles => prevVehicles.filter(vehicle => vehicle.id !== vehicleId));
  };

  return (
    <MyVehiclesContext.Provider value={{ myVehicles, addMyVehicle, updateMyVehicle, deleteMyVehicle }}>
      {children}
    </MyVehiclesContext.Provider>
  );
}

export function useMyVehicles() {
  const context = useContext(MyVehiclesContext);
  if (context === undefined) {
    throw new Error('useMyVehicles must be used within a MyVehiclesProvider');
  }
  return context;
}
