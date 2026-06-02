import { Car, StateTax, BankRate } from './types';

export const STATES: StateTax[] = [
  {
    code: 'KA',
    name: 'Karnataka (Bengaluru)',
    roadTaxPetrol: 18.0,
    roadTaxDiesel: 18.0,
    roadTaxEV: 4.0,
    roadTaxHybrid: 10.0,
    insurancePct: 3.5,
    registrationFlat: 18000,
    tcsPct: 1.0,
    fastagCharges: 500,
    handlingCharges: 2500
  },
  {
    code: 'DL',
    name: 'Delhi (NCR)',
    roadTaxPetrol: 10.0,
    roadTaxDiesel: 12.5,
    roadTaxEV: 0.0,
    roadTaxHybrid: 5.0,
    insurancePct: 3.2,
    registrationFlat: 12000,
    tcsPct: 1.0,
    fastagCharges: 500,
    handlingCharges: 1500
  },
  {
    code: 'MH',
    name: 'Maharashtra (Mumbai)',
    roadTaxPetrol: 11.0,
    roadTaxDiesel: 13.0,
    roadTaxEV: 0.0,
    roadTaxHybrid: 6.0,
    insurancePct: 3.4,
    registrationFlat: 15000,
    tcsPct: 1.0,
    fastagCharges: 500,
    handlingCharges: 2000
  },
  {
    code: 'TN',
    name: 'Tamil Nadu (Chennai)',
    roadTaxPetrol: 12.0,
    roadTaxDiesel: 12.0,
    roadTaxEV: 0.0,
    roadTaxHybrid: 8.0,
    insurancePct: 3.3,
    registrationFlat: 14000,
    tcsPct: 1.0,
    fastagCharges: 500,
    handlingCharges: 1800
  },
  {
    code: 'GJ',
    name: 'Gujarat (Ahmedabad)',
    roadTaxPetrol: 6.0,
    roadTaxDiesel: 6.0,
    roadTaxEV: 0.0,
    roadTaxHybrid: 4.0,
    insurancePct: 3.1,
    registrationFlat: 10000,
    tcsPct: 1.0,
    fastagCharges: 500,
    handlingCharges: 1200
  },
  {
    code: 'UP',
    name: 'Uttar Pradesh (Lucknow)',
    roadTaxPetrol: 8.0,
    roadTaxDiesel: 8.0,
    roadTaxEV: 0.0,
    roadTaxHybrid: 5.0,
    insurancePct: 3.3,
    registrationFlat: 11000,
    tcsPct: 1.0,
    fastagCharges: 500,
    handlingCharges: 1500
  }
];

export const BANKS: BankRate[] = [
  {
    id: 'sbi',
    name: 'State Bank of India',
    logo: '🏦',
    interestRate: 8.85,
    processingFeePct: 0.25,
    processingFeeMax: 5000
  },
  {
    id: 'hdfc',
    name: 'HDFC Bank',
    logo: '💳',
    interestRate: 9.15,
    processingFeePct: 0.5,
    processingFeeMax: 7500
  },
  {
    id: 'icici',
    name: 'ICICI Bank',
    logo: '🛡️',
    interestRate: 9.10,
    processingFeePct: 0.4,
    processingFeeMax: 6000
  },
  {
    id: 'axis',
    name: 'Axis Bank',
    logo: '📈',
    interestRate: 9.20,
    processingFeePct: 0.5,
    processingFeeMax: 8000
  },
  {
    id: 'kotak',
    name: 'Kotak Mahindra Bank',
    logo: '💰',
    interestRate: 9.25,
    processingFeePct: 0.5,
    processingFeeMax: 7000
  },
  {
    id: 'bob',
    name: 'Bank of Baroda',
    logo: '🏛️',
    interestRate: 8.90,
    processingFeePct: 0.25,
    processingFeeMax: 4500
  },
  {
    id: 'pnb',
    name: 'Punjab National Bank',
    logo: '🏣',
    interestRate: 8.95,
    processingFeePct: 0.3,
    processingFeeMax: 5000
  }
];

export const CARS: Car[] = [
  {
    id: 'maruti-swift',
    brand: 'Maruti Suzuki',
    model: 'Swift',
    bodyType: 'Hatchback',
    fuelType: ['Petrol', 'CNG'],
    transmission: ['Manual', 'Automatic'],
    specs: {
      engine: '1197 cc, 3 Cyl, Z-Series',
      power: '80.4 bhp @ 5700 rpm',
      torque: '111.7 Nm @ 4300 rpm',
      mileage: 24.8,
      seatingCapacity: 5
    },
    safetyRating: 4,
    images: {
      front: '/images/cars/swift-front.png',
      side: '/images/cars/swift-side.png',
      interior: '/images/cars/swift-interior.png',
      dashboard: '/images/cars/swift-dashboard.png'
    },
    variants: [
      { name: 'LXi 1.2L Petrol MT', exShowroomPrice: 649000 },
      { name: 'VXi 1.2L Petrol MT', exShowroomPrice: 729000 },
      { name: 'VXi 1.2L Petrol AMT', exShowroomPrice: 779000 },
      { name: 'ZXi 1.2L Petrol MT', exShowroomPrice: 829000 },
      { name: 'ZXi+ 1.2L Petrol AMT', exShowroomPrice: 964000 }
    ],
    featured: true
  },
  {
    id: 'tata-nexon',
    brand: 'Tata Motors',
    model: 'Nexon',
    bodyType: 'SUV',
    fuelType: ['Petrol', 'Diesel'],
    transmission: ['Manual', 'Automatic'],
    specs: {
      engine: '1199 cc, 3 Cyl, Turbo Petrol / 1497 cc Diesel',
      power: '118 bhp @ 5500 rpm',
      torque: '170 Nm @ 1750 rpm',
      mileage: 17.44,
      seatingCapacity: 5
    },
    safetyRating: 5,
    images: {
      front: '/images/cars/nexon-front.png',
      side: '/images/cars/nexon-side.png',
      interior: '/images/cars/nexon-interior.png',
      dashboard: '/images/cars/nexon-dashboard.png'
    },
    variants: [
      { name: 'Smart 1.2L Petrol MT', exShowroomPrice: 799900 },
      { name: 'Pure 1.2L Petrol MT', exShowroomPrice: 979900 },
      { name: 'Creative 1.2L Petrol AMT', exShowroomPrice: 1169900 },
      { name: 'Creative 1.5L Diesel MT', exShowroomPrice: 1299900 },
      { name: 'Fearless+ S 1.5L Diesel DCA', exShowroomPrice: 1579900 }
    ],
    featured: true
  },
  {
    id: 'hyundai-creta',
    brand: 'Hyundai',
    model: 'Creta',
    bodyType: 'SUV',
    fuelType: ['Petrol', 'Diesel'],
    transmission: ['Manual', 'Automatic'],
    specs: {
      engine: '1497 cc Petrol / 1493 cc Diesel',
      power: '113.18 bhp @ 6300 rpm',
      torque: '250 Nm @ 1500 rpm',
      mileage: 18.2,
      seatingCapacity: 5
    },
    safetyRating: 5,
    images: {
      front: '/images/cars/creta-front.png',
      side: '/images/cars/creta-side.png',
      interior: '/images/cars/creta-interior.png',
      dashboard: '/images/cars/creta-dashboard.png'
    },
    variants: [
      { name: 'E 1.5L Petrol MT', exShowroomPrice: 1099900 },
      { name: 'S 1.5L Petrol MT', exShowroomPrice: 1339000 },
      { name: 'SX 1.5L Petrol CVT', exShowroomPrice: 1582900 },
      { name: 'SX (O) 1.5L Diesel MT', exShowroomPrice: 1724000 },
      { name: 'SX (O) 1.5L Diesel AT', exShowroomPrice: 2014900 }
    ],
    featured: true
  },
  {
    id: 'mahindra-thar',
    brand: 'Mahindra',
    model: 'Thar',
    bodyType: 'SUV',
    fuelType: ['Petrol', 'Diesel'],
    transmission: ['Manual', 'Automatic'],
    specs: {
      engine: '1997 cc Turbo Petrol / 2184 cc Diesel',
      power: '150 bhp @ 5000 rpm',
      torque: '320 Nm @ 1500 rpm',
      mileage: 15.2,
      seatingCapacity: 4
    },
    safetyRating: 4,
    images: {
      front: '/images/cars/thar-front.png',
      side: '/images/cars/thar-side.png',
      interior: '/images/cars/thar-interior.png',
      dashboard: '/images/cars/thar-dashboard.png'
    },
    variants: [
      { name: 'AX Opt 2.0L Petrol MT 4WD', exShowroomPrice: 1135000 },
      { name: 'LX 1.5L Diesel MT RWD', exShowroomPrice: 1285000 },
      { name: 'LX 2.2L Diesel MT 4WD', exShowroomPrice: 1520000 },
      { name: 'LX 2.0L Petrol AT 4WD', exShowroomPrice: 1700000 },
      { name: 'LX 2.2L Diesel AT 4WD Earth Ed', exShowroomPrice: 1760000 }
    ],
    featured: true
  },
  {
    id: 'tata-nexon-ev',
    brand: 'Tata Motors',
    model: 'Nexon EV',
    bodyType: 'EV',
    fuelType: ['Electric'],
    transmission: ['Automatic'],
    specs: {
      engine: 'Permanent Magnet Synchronous Motor (PMSM)',
      power: '142.6 bhp (Long Range)',
      torque: '215 Nm',
      mileage: 465, // km/charge
      seatingCapacity: 5
    },
    safetyRating: 5,
    images: {
      front: '/images/cars/nexonev-front.png',
      side: '/images/cars/nexonev-side.png',
      interior: '/images/cars/nexonev-interior.png',
      dashboard: '/images/cars/nexonev-dashboard.png'
    },
    variants: [
      { name: 'Creative+ MR (30 kWh)', exShowroomPrice: 1449000 },
      { name: 'Fearless MR (30 kWh)', exShowroomPrice: 1599000 },
      { name: 'Fearless+ LR (40.5 kWh)', exShowroomPrice: 1699000 },
      { name: 'Empowered LR (40.5 kWh)', exShowroomPrice: 1929000 }
    ],
    featured: true
  },
  {
    id: 'toyota-fortuner',
    brand: 'Toyota',
    model: 'Fortuner',
    bodyType: 'SUV',
    fuelType: ['Petrol', 'Diesel'],
    transmission: ['Manual', 'Automatic'],
    specs: {
      engine: '2694 cc Petrol / 2755 cc Diesel',
      power: '201.15 bhp @ 3400 rpm',
      torque: '500 Nm @ 1600 rpm',
      mileage: 14.4,
      seatingCapacity: 7
    },
    safetyRating: 5,
    images: {
      front: '/images/cars/fortuner-front.png',
      side: '/images/cars/fortuner-side.png',
      interior: '/images/cars/fortuner-interior.png',
      dashboard: '/images/cars/fortuner-dashboard.png'
    },
    variants: [
      { name: '2.7L Petrol MT 2WD', exShowroomPrice: 3343000 },
      { name: '2.7L Petrol AT 2WD', exShowroomPrice: 3502000 },
      { name: '2.8L Diesel MT 2WD', exShowroomPrice: 3593000 },
      { name: '2.8L Diesel AT 4WD', exShowroomPrice: 4235000 },
      { name: 'GR-S 2.8L Diesel AT 4WD', exShowroomPrice: 5144000 }
    ],
    featured: true
  },
  {
    id: 'bmw-3gl',
    brand: 'BMW',
    model: '3 Series Gran Limousine',
    bodyType: 'Luxury',
    fuelType: ['Petrol', 'Diesel'],
    transmission: ['Automatic'],
    specs: {
      engine: '1998 cc TwinPower Turbo Petrol / 1995 cc Diesel',
      power: '258 bhp @ 5000 rpm',
      torque: '400 Nm @ 1550 rpm',
      mileage: 19.6,
      seatingCapacity: 5
    },
    safetyRating: 5,
    images: {
      front: '/images/cars/bmw3-front.png',
      side: '/images/cars/bmw3-side.png',
      interior: '/images/cars/bmw3-interior.png',
      dashboard: '/images/cars/bmw3-dashboard.png'
    },
    variants: [
      { name: '330Li M Sport (Petrol)', exShowroomPrice: 6060000 },
      { name: '320Ld Luxury Line (Diesel)', exShowroomPrice: 6260000 }
    ],
    featured: true
  },
  // Add other brands with simplified entries to cover all 23 requested brands
  {
    id: 'kia-seltos',
    brand: 'Kia',
    model: 'Seltos',
    bodyType: 'SUV',
    fuelType: ['Petrol', 'Diesel'],
    transmission: ['Manual', 'Automatic'],
    specs: { engine: '1497 cc', power: '113 bhp', torque: '144 Nm', mileage: 17.0, seatingCapacity: 5 },
    safetyRating: 3,
    images: { front: '', side: '', interior: '', dashboard: '' },
    variants: [
      { name: 'HTE 1.5L Petrol MT', exShowroomPrice: 1090000 },
      { name: 'HTX 1.5L Petrol CVT', exShowroomPrice: 1660000 },
      { name: 'GT-Line 1.5L Turbo DCT', exShowroomPrice: 2035000 }
    ]
  },
  {
    id: 'honda-city',
    brand: 'Honda',
    model: 'City',
    bodyType: 'Sedan',
    fuelType: ['Petrol', 'Hybrid'],
    transmission: ['Manual', 'Automatic'],
    specs: { engine: '1498 cc', power: '119 bhp', torque: '145 Nm', mileage: 18.4, seatingCapacity: 5 },
    safetyRating: 5,
    images: { front: '', side: '', interior: '', dashboard: '' },
    variants: [
      { name: 'SV 1.5L Petrol MT', exShowroomPrice: 1182000 },
      { name: 'VX 1.5L Petrol CVT', exShowroomPrice: 1472000 },
      { name: 'ZX 1.5L e:HEV Hybrid', exShowroomPrice: 2050000 }
    ]
  },
  {
    id: 'mg-hector',
    brand: 'MG Motor',
    model: 'Hector',
    bodyType: 'SUV',
    fuelType: ['Petrol', 'Diesel'],
    transmission: ['Manual', 'Automatic'],
    specs: { engine: '1956 cc', power: '168 bhp', torque: '350 Nm', mileage: 15.5, seatingCapacity: 5 },
    safetyRating: 5,
    images: { front: '', side: '', interior: '', dashboard: '' },
    variants: [
      { name: 'Style 1.5L Petrol MT', exShowroomPrice: 1399000 },
      { name: 'Sharp Pro 2.0L Diesel MT', exShowroomPrice: 2190000 }
    ]
  },
  {
    id: 'skoda-slavia',
    brand: 'Skoda',
    model: 'Slavia',
    bodyType: 'Sedan',
    fuelType: ['Petrol'],
    transmission: ['Manual', 'Automatic'],
    specs: { engine: '999 cc / 1498 cc Turbo', power: '148 bhp', torque: '250 Nm', mileage: 19.4, seatingCapacity: 5 },
    safetyRating: 5,
    images: { front: '', side: '', interior: '', dashboard: '' },
    variants: [
      { name: 'Classic 1.0L TSI MT', exShowroomPrice: 1069000 },
      { name: 'Prestige 1.5L TSI DSG', exShowroomPrice: 1869000 }
    ]
  },
  {
    id: 'vw-virtus',
    brand: 'Volkswagen',
    model: 'Virtus',
    bodyType: 'Sedan',
    fuelType: ['Petrol'],
    transmission: ['Manual', 'Automatic'],
    specs: { engine: '999 cc / 1498 cc Turbo', power: '148 bhp', torque: '250 Nm', mileage: 19.6, seatingCapacity: 5 },
    safetyRating: 5,
    images: { front: '', side: '', interior: '', dashboard: '' },
    variants: [
      { name: 'Comfortline 1.0L TSI MT', exShowroomPrice: 1156000 },
      { name: 'GT Plus Sport 1.5L TSI DSG', exShowroomPrice: 1941000 }
    ]
  },
  {
    id: 'nissan-magnite',
    brand: 'Nissan',
    model: 'Magnite',
    bodyType: 'Hatchback',
    fuelType: ['Petrol'],
    transmission: ['Manual', 'Automatic'],
    specs: { engine: '999 cc', power: '71 bhp', torque: '96 Nm', mileage: 19.3, seatingCapacity: 5 },
    safetyRating: 4,
    images: { front: '', side: '', interior: '', dashboard: '' },
    variants: [
      { name: 'XE 1.0L Petrol MT', exShowroomPrice: 600000 },
      { name: 'XV Premium 1.0L Turbo CVT', exShowroomPrice: 1127000 }
    ]
  },
  {
    id: 'renault-kiger',
    brand: 'Renault',
    model: 'Kiger',
    bodyType: 'SUV',
    fuelType: ['Petrol'],
    transmission: ['Manual', 'Automatic'],
    specs: { engine: '999 cc', power: '99 bhp', torque: '160 Nm', mileage: 19.7, seatingCapacity: 5 },
    safetyRating: 4,
    images: { front: '', side: '', interior: '', dashboard: '' },
    variants: [
      { name: 'RXE 1.0L MT', exShowroomPrice: 600000 },
      { name: 'RXZ 1.0L Turbo CVT', exShowroomPrice: 1123000 }
    ]
  },
  {
    id: 'citroen-c3',
    brand: 'Citroen',
    model: 'C3',
    bodyType: 'Hatchback',
    fuelType: ['Petrol'],
    transmission: ['Manual', 'Automatic'],
    specs: { engine: '1199 cc', power: '109 bhp', torque: '190 Nm', mileage: 19.3, seatingCapacity: 5 },
    safetyRating: 3,
    images: { front: '', side: '', interior: '', dashboard: '' },
    variants: [
      { name: 'Live 1.2L Petrol MT', exShowroomPrice: 616000 },
      { name: 'Shine 1.2L Turbo AT', exShowroomPrice: 1027000 }
    ]
  },
  {
    id: 'jeep-compass',
    brand: 'Jeep',
    model: 'Compass',
    bodyType: 'SUV',
    fuelType: ['Diesel'],
    transmission: ['Manual', 'Automatic'],
    specs: { engine: '1956 cc', power: '168 bhp', torque: '350 Nm', mileage: 16.2, seatingCapacity: 5 },
    safetyRating: 5,
    images: { front: '', side: '', interior: '', dashboard: '' },
    variants: [
      { name: 'Sport 2.0L Diesel MT', exShowroomPrice: 2069000 },
      { name: 'Model-S 2.0L Diesel AT 4WD', exShowroomPrice: 3241000 }
    ]
  },
  {
    id: 'byd-seal',
    brand: 'BYD',
    model: 'Seal',
    bodyType: 'EV',
    fuelType: ['Electric'],
    transmission: ['Automatic'],
    specs: { engine: 'Electric Motor (RWD/AWD)', power: '523 bhp', torque: '670 Nm', mileage: 650, seatingCapacity: 5 },
    safetyRating: 5,
    images: { front: '', side: '', interior: '', dashboard: '' },
    variants: [
      { name: 'Dynamic (61.4 kWh RWD)', exShowroomPrice: 4100000 },
      { name: 'Premium (82.5 kWh RWD)', exShowroomPrice: 4550000 },
      { name: 'Performance (82.5 kWh AWD)', exShowroomPrice: 5300000 }
    ]
  },
  {
    id: 'mercedes-cclass',
    brand: 'Mercedes-Benz',
    model: 'C-Class',
    bodyType: 'Luxury',
    fuelType: ['Petrol', 'Diesel'],
    transmission: ['Automatic'],
    specs: { engine: '1496 cc Petrol / 1999 cc Diesel', power: '201 bhp', torque: '300 Nm', mileage: 16.9, seatingCapacity: 5 },
    safetyRating: 5,
    images: { front: '', side: '', interior: '', dashboard: '' },
    variants: [
      { name: 'C 200 Avantgarde (Petrol)', exShowroomPrice: 6185000 },
      { name: 'C 220d Avantgarde (Diesel)', exShowroomPrice: 6300000 }
    ]
  },
  {
    id: 'audi-a4',
    brand: 'Audi',
    model: 'A4',
    bodyType: 'Luxury',
    fuelType: ['Petrol'],
    transmission: ['Automatic'],
    specs: { engine: '1984 cc', power: '202 bhp', torque: '320 Nm', mileage: 17.4, seatingCapacity: 5 },
    safetyRating: 5,
    images: { front: '', side: '', interior: '', dashboard: '' },
    variants: [
      { name: 'Premium 40 TFSI', exShowroomPrice: 4602000 },
      { name: 'Technology 40 TFSI', exShowroomPrice: 5458000 }
    ]
  },
  {
    id: 'volvo-xc40-recharge',
    brand: 'Volvo',
    model: 'XC40 Recharge',
    bodyType: 'EV',
    fuelType: ['Electric'],
    transmission: ['Automatic'],
    specs: { engine: 'Dual Electric Motors', power: '408 bhp', torque: '660 Nm', mileage: 418, seatingCapacity: 5 },
    safetyRating: 5,
    images: { front: '', side: '', interior: '', dashboard: '' },
    variants: [
      { name: 'Single Motor RWD', exShowroomPrice: 5495000 },
      { name: 'Twin Motor AWD', exShowroomPrice: 5790000 }
    ]
  },
  {
    id: 'lexus-es',
    brand: 'Lexus',
    model: 'ES',
    bodyType: 'Luxury',
    fuelType: ['Hybrid'],
    transmission: ['Automatic'],
    specs: { engine: '2487 cc Hybrid', power: '175 bhp', torque: '221 Nm', mileage: 22.5, seatingCapacity: 5 },
    safetyRating: 5,
    images: { front: '', side: '', interior: '', dashboard: '' },
    variants: [
      { name: 'Exquisite 300h', exShowroomPrice: 6310000 },
      { name: 'Luxury 300h', exShowroomPrice: 6970000 }
    ]
  },
  {
    id: 'jlr-defender',
    brand: 'Jaguar Land Rover',
    model: 'Land Rover Defender',
    bodyType: 'Luxury',
    fuelType: ['Petrol', 'Diesel'],
    transmission: ['Automatic'],
    specs: { engine: '2996 cc', power: '296 bhp', torque: '650 Nm', mileage: 11.5, seatingCapacity: 5 },
    safetyRating: 5,
    images: { front: '', side: '', interior: '', dashboard: '' },
    variants: [
      { name: 'Defender 90 HSE 2.0L Petrol', exShowroomPrice: 9700000 },
      { name: 'Defender 110 HSE 3.0L Diesel', exShowroomPrice: 12000000 }
    ]
  },
  {
    id: 'mini-cooper',
    brand: 'Mini',
    model: 'Cooper S',
    bodyType: 'Hatchback',
    fuelType: ['Petrol'],
    transmission: ['Automatic'],
    specs: { engine: '1998 cc Turbo', power: '189 bhp', torque: '280 Nm', mileage: 16.5, seatingCapacity: 4 },
    safetyRating: 4,
    images: { front: '', side: '', interior: '', dashboard: '' },
    variants: [
      { name: 'Standard Cooper S', exShowroomPrice: 4270000 }
    ]
  },
  {
    id: 'porsche-macan',
    brand: 'Porsche',
    model: 'Macan',
    bodyType: 'Luxury',
    fuelType: ['Petrol'],
    transmission: ['Automatic'],
    specs: { engine: '1984 cc Turbo', power: '261 bhp', torque: '400 Nm', mileage: 11.4, seatingCapacity: 5 },
    safetyRating: 5,
    images: { front: '', side: '', interior: '', dashboard: '' },
    variants: [
      { name: 'Standard Macan', exShowroomPrice: 8806000 },
      { name: 'Macan S 2.9L Twin-Turbo', exShowroomPrice: 14300000 }
    ]
  }
];

export const BODY_TYPES = ['All', 'Hatchback', 'Sedan', 'SUV', 'EV', 'Luxury'] as const;
export const FUEL_TYPES = ['All', 'Petrol', 'Diesel', 'CNG', 'Electric', 'Hybrid'] as const;
export const TRANSMISSIONS = ['All', 'Manual', 'Automatic'] as const;
export const SEATING_CAPACITIES = ['All', '4', '5', '7'] as const;

export function getLocalCars(): Car[] {
  if (typeof window === 'undefined') return CARS as Car[];
  const saved = localStorage.getItem('local_cars');
  if (saved) {
    try {
      return JSON.parse(saved) as Car[];
    } catch (e) {
      console.error('Failed to parse local_cars', e);
    }
  }
  return CARS as Car[];
}

export function saveLocalCars(carsList: Car[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('local_cars', JSON.stringify(carsList));
  }
}

export function getLocalStates(): StateTax[] {
  if (typeof window === 'undefined') return STATES as StateTax[];
  const saved = localStorage.getItem('local_states');
  if (saved) {
    try {
      return JSON.parse(saved) as StateTax[];
    } catch (e) {
      console.error('Failed to parse local_states', e);
    }
  }
  return STATES as StateTax[];
}

export function saveLocalStates(statesList: StateTax[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('local_states', JSON.stringify(statesList));
  }
}

export function getLocalBanks(): BankRate[] {
  if (typeof window === 'undefined') return BANKS as BankRate[];
  const saved = localStorage.getItem('local_banks');
  if (saved) {
    try {
      return JSON.parse(saved) as BankRate[];
    } catch (e) {
      console.error('Failed to parse local_banks', e);
    }
  }
  return BANKS as BankRate[];
}

export function saveLocalBanks(banksList: BankRate[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('local_banks', JSON.stringify(banksList));
  }
}


