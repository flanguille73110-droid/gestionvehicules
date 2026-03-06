import { createContext, useContext, useState, ReactNode } from 'react';
import { MaintenanceRecord } from '../types';

interface MaintenanceContextType {
  maintenanceRecords: MaintenanceRecord[];
  addMaintenanceRecord: (record: Omit<MaintenanceRecord, 'id'>) => void;
  updateMaintenanceRecord: (updatedRecord: MaintenanceRecord) => void;
  deleteMaintenanceRecord: (recordId: string) => void;
}

const MaintenanceContext = createContext<MaintenanceContextType | undefined>(undefined);

export function MaintenanceProvider({ children }: { children: ReactNode }) {
  const [maintenanceRecords, setMaintenanceRecords] = useState<MaintenanceRecord[]>([]);

  const addMaintenanceRecord = (record: Omit<MaintenanceRecord, 'id'>) => {
    const newRecord: MaintenanceRecord = {
      ...record,
      id: crypto.randomUUID(),
      mileage: record.mileage || 0,
      provider: record.provider || '',
      amount: record.amount || 0,
      invoicePdf: record.invoicePdf || undefined,
    };
    setMaintenanceRecords(prevRecords => [...prevRecords, newRecord]);
  };

  const updateMaintenanceRecord = (updatedRecord: MaintenanceRecord) => {
    setMaintenanceRecords(prevRecords =>
      prevRecords.map(record =>
        record.id === updatedRecord.id ? updatedRecord : record
      )
    );
  };

  const deleteMaintenanceRecord = (recordId: string) => {
    setMaintenanceRecords(prevRecords => prevRecords.filter(record => record.id !== recordId));
  };

  return (
    <MaintenanceContext.Provider value={{ maintenanceRecords, addMaintenanceRecord, updateMaintenanceRecord, deleteMaintenanceRecord }}>
      {children}
    </MaintenanceContext.Provider>
  );
}

export function useMaintenance() {
  const context = useContext(MaintenanceContext);
  if (context === undefined) {
    throw new Error('useMaintenance must be used within a MaintenanceProvider');
  }
  return context;
}
