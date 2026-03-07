import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { VehicleModel } from '../types';
import { vehicleData } from '../data/vehicleData';

// Helper to transform the static data into the context's state structure
const initialModels: VehicleModel[] = [];
for (const brand in vehicleData) {
  const models = vehicleData[brand as keyof typeof vehicleData];
  for (const modelName in models) {
    const engines = (models as any)[modelName];
    if (Array.isArray(engines)) {
      engines.forEach(engine => {
        initialModels.push({
          id: crypto.randomUUID(),
          brand,
          modelName,
          engine,
        });
      });
    }
  }
}

interface VehicleModelContextType {
  vehicleModels: VehicleModel[];
  addVehicleModel: (model: Omit<VehicleModel, 'id'>) => void;
}

const VehicleModelContext = createContext<VehicleModelContextType | undefined>(undefined);

const STORAGE_KEY = 'autosuivi_vehicle_models';

export function VehicleModelProvider({ children }: { children: ReactNode }) {
  const [vehicleModels, setVehicleModels] = useState<VehicleModel[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Merge stored models with initial models to ensure we have the latest static data
      // but keep user-added models
      const initialIds = new Set(initialModels.map(m => `${m.brand}-${m.modelName}-${m.engine}`));
      const userModels = parsed.filter((m: VehicleModel) => !initialIds.has(`${m.brand}-${m.modelName}-${m.engine}`));
      return [...initialModels, ...userModels];
    }
    return initialModels;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(vehicleModels));
  }, [vehicleModels]);

  const addVehicleModel = (model: Omit<VehicleModel, 'id'>) => {
    const newModel = { ...model, id: crypto.randomUUID() };
    // Avoid adding duplicates
    if (!vehicleModels.some(vm => vm.brand === newModel.brand && vm.modelName === newModel.modelName && vm.engine === newModel.engine)) {
      setVehicleModels(prevModels => [...prevModels, newModel]);
    }
  };

  return (
    <VehicleModelContext.Provider value={{ vehicleModels, addVehicleModel }}>
      {children}
    </VehicleModelContext.Provider>
  );
}

export function useVehicleModels() {
  const context = useContext(VehicleModelContext);
  if (context === undefined) {
    throw new Error('useVehicleModels must be used within a VehicleModelProvider');
  }
  return context;
}
