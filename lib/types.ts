export interface VehicleData {
    id: string
    title: string
    year?: string
    brand?: string
    model?: string
    condition: 'new' | 'slightly used' | 'used'
    mileage: string
    price: string
    fuelType: 'petrol' | 'diesel' | 'electric' | 'hybrid'
    transmission: 'manual' | 'automatic'
    engine: string
    location: {
      region: string
      town: string
      otherTown?: string
    }
    description: string
    gearCount: string
    VIN: string
    colour: string
    frameMaterial: string
    brakeType: string
    bikeType: string
    bodyType: string
    features: []
    category?: 'car' | 'bike'
    status?: 'available' | 'sold'
    images: string[]
    imageUrls: string[]
    coverImage: string
    createdAt: any
    views?: string[]
  }

  // {
  //   id: string
  //   title: string
  //   year?: string
  //   brand?: string
  //   model?: string
  //   condition: 'new' | 'slightly used' | 'used'
  //   mileage: string
  //   price: string
  //   fuelType: 'petrol' | 'diesel' | 'electric' | 'hybrid'
  //   transmission: 'manual' | 'automatic'
  //   engine: string
  //   location: {
  //     region: string
  //     town: string
  //     otherTown?: string
  //   }
  //   description: string
  //   gearCount: string
  //   VIN: string
  //   colour: string
  //   frameMaterial: string
  //   brakeType: string
  //   bikeType: string
  //   bodyType: string
  //   features: []
  //   images: string[]
  //   imageUrls: string[]
  //   category?: 'car' | 'bike'
  //   coverImage: string
  //   createdAt: any
  //   views?: string[]
  // }