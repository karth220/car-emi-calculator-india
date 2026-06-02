export interface CarVariant {
  name: string;
  exShowroomPrice: number; // in Rupees
}

export interface CarSpecs {
  engine: string;
  power: string;
  torque: string;
  mileage: number; // kmpl or km/charge
  seatingCapacity: number;
}

export type BodyType = 'Hatchback' | 'Sedan' | 'SUV' | 'MUV' | 'EV' | 'Luxury';
export type FuelType = 'Petrol' | 'Diesel' | 'CNG' | 'Electric' | 'Hybrid';
export type TransmissionType = 'Manual' | 'Automatic';

export interface CarImages {
  front: string;
  side: string;
  interior: string;
  dashboard: string;
}

export interface Car {
  id: string;
  brand: string;
  model: string;
  bodyType: BodyType;
  fuelType: FuelType[];
  transmission: TransmissionType[];
  specs: CarSpecs;
  safetyRating: number; // 0 to 5
  images: CarImages;
  variants: CarVariant[];
  featured?: boolean;
}

export interface StateTax {
  code: string;
  name: string;
  roadTaxPetrol: number; // percentage
  roadTaxDiesel: number; // percentage
  roadTaxEV: number; // percentage
  roadTaxHybrid: number; // percentage
  insurancePct: number; // percentage of ex-showroom
  registrationFlat: number; // flat fee
  tcsPct: number; // tax collected at source (>10 Lakh)
  fastagCharges: number;
  handlingCharges: number;
}

export interface BankRate {
  id: string;
  name: string;
  logo: string;
  interestRate: number; // annual percentage
  processingFeePct: number; // percentage of loan amount
  processingFeeMax: number; // maximum cap
}
