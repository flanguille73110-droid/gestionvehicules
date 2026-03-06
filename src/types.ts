export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
}

export interface Service {
  id: string;
  name: string;
  price?: string;
}

export interface MaintenanceRecord {
  id: string;
  vehicleId: string;
  serviceId: string; // Peut contenir plusieurs IDs séparés par des virgules
  date: string;
  mileage: number;
  notes: string;
  provider: string;
  amount: number;
  invoicePdf?: string; // PDF encodé en Base64 (optionnel)
}

export interface VehicleModel {
  id: string;
  brand: string;
  modelName: string;
  engine: string;
  licensePlate?: string;
  firstRegistrationDate?: string;
  tireSize?: string;
  wiperDriver?: string;
  wiperPassenger?: string;
  wiperRear?: string;
  oilRef?: string;
  nextCTDate?: string;
  currentKm?: string;
  maintenancePlan?: {
    id: string;
    operation: string;
    kmOrYear: string;
    plannedDate: string;
    price?: string;
  }[];
  plannedPrograms?: {
    id: string;
    operationName: string;
    kmOrYear: string;
    plannedDate: string;
    plannedKm: string;
    price?: string;
  }[];
}
