'use client'

import { Header } from '@/components/header'
import { sendVehicleNotification } from '@/utils/notifications/sendNotification'
import { validateVehicleForm } from '@/utils/postValidation'
import { createVehicle } from '@/utils/postVehicle'
import { set } from 'date-fns'
import { ca } from 'date-fns/locale'
import { ArrowLeft, Car, Upload, X, Bike, Plus, Trash } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function PostVehiclePage() {
  const router = useRouter();

//   const finalCoverIndex = coverIndex ?? 0;
//   const coverImage = images[finalCoverIndex];

//   useEffect(() => {
//   if (images.length > 0 && coverIndex === null) {
//     setCoverIndex(0);
//   }
// }, [images]);




  const regionsAndTowns: Record<string, string[]> = {
  "Greater Accra": [
    "Accra",
    "Tema",
    "Lapaz",
    "Madina",
    "Kasoa"
  ],
  "Ashanti": [
    "Kumasi",
    "Obuasi",
    "Ejisu"
  ]
};

// type Region = keyof typeof regionsAndTowns;

  const [locationData, setLocationData] = useState({
    region: "greater accra",
    town: "",
    otherTown: ""
  });

  const [loading, setLoading] = useState(false);

  type ImageItem = {
    file: File;
    preview: string;
  };

  const [images, setImages] = useState<ImageItem[]>([]);
  const [coverIndex, setCoverIndex] = useState<number | null>(null);
  const [error, setError] = useState<string>("");
  const [category, setCategory] = useState<'car' | 'bike'>('car')

const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  const files = Array.from(e.target.files || []);
  setError("");

  if (images.length + files.length > 5) {
    setError("You can only upload up to 5 images.");
    return;
  }

  const validImages: ImageItem[] = [];

  files.forEach((file) => {
    if (file.size > 1024 * 1024) {
      setError("Each image must be less than 1MB.");
      return;
    }

    validImages.push({
      file,
      preview: URL.createObjectURL(file),
    });
  });

  setImages((prev) => [...prev, ...validImages]);

  // Auto-set first image as cover
  if (coverIndex === null && validImages.length > 0) {
    setCoverIndex(0);
  }
};


const removeImage = (index: number) => {
  setImages((prev) => {
    const newImages = prev.filter((_, i) => i !== index);

    // If no images left
    if (newImages.length === 0) {
      setCoverIndex(null);
      return newImages;
    }

    // If removed image WAS the cover
    if (coverIndex === index) {
      setCoverIndex(0); // first image becomes cover
    } 
    // If removed image is BEFORE cover, shift index
    else if (coverIndex !== null && index < coverIndex) {
      setCoverIndex(coverIndex - 1);
    }

    return newImages;
  });
};



  const [featureData, setFeatureData] = useState<string[]>([]);

  const [feature, setFeature] = useState('');
  
  const initialFormData = {
      title: '',
      year: '',
      brand: '',
      model: '',
      condition: '',
      mileage: '',
      price: '',
      fuelType: '',
      transmission: '',
      engine: '',
      location: '',
      description: '',
      gearCount: '',
      VIN: '',
      colour: '',
      frameMaterial: '',
      brakeType: '',
      bikeType: '',
      bodyType: '',
      features: []
    }
  const [formData, setFormData] = useState(initialFormData);

  const handleAddFeature = () => {
    if (feature.trim() !== '') {
      setFeatureData(prev => [...prev, feature.trim()])
      setFeature('')
    }
  }

  const handleRemoveFeature = (featureToRemove: string) => {
    setFeatureData(prev => prev.filter(feature => feature !== featureToRemove))
  }

  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
  const { name, value } = e.target;

  setLocationData((prev) => ({
    ...prev,
    [name]: value,
  }));

  // Reset town when region changes
  if (name === "region") {
    setLocationData((prev) => ({
      ...prev,
      region: value,
      town: "",
      otherTown: ""
    }));
  }
};

  // const [uploadedImages, setUploadedImages] = useState<string[]>([])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setLoading(true);

    console.log('Vehicle posted:', { ...formData, features: featureData, images, location: locationData, category})
    const isValid = validateVehicleForm({ ...formData, features: featureData, location: locationData, images, coverIndex }, category)
    if (!isValid || coverIndex === null) return;

    const vehicleId = await createVehicle({ ...formData, features: featureData, location: locationData }, images, coverIndex)
    
    setLoading(false);

    if (!vehicleId.success) return;

    setFormData(initialFormData);
    setFeatureData([]);
    setImages([]);
    setCoverIndex(null);
    setLocationData({
      region: 'greater accra',
      town: '',
      otherTown: ''
    });

    router.push('/main');
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-6">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-[#FF6B7A] hover:text-[#FF5566] font-semibold mb-4"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Post Your Vehicle</h1>
            <p className="text-gray-600 mt-2">Fill in the details below to list your vehicle</p>
          </div>

          <div className="flex gap-4 mb-6">
            <button 
              onClick={() => setCategory('car')}
              className={`${category === 'car' ? 'bg-[#FF6B7A] hover:bg-[#FF5566] text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-500'} flex gap-2 px-4 py-2 rounded-lg font-semibold transition-colors`}
            >
              <Car className='w-5 h-5' />
              Car
            </button>
            <button 
              onClick={() => setCategory('bike')}
              className={`${category === 'bike' ? 'bg-[#FF6B7A] hover:bg-[#FF5566] text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-500'} flex gap-2 px-4 py-2 rounded-lg font-semibold transition-colors`}
            >
              <Bike className='w-5 h-5' />
              Bike
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Vehicle Details */}
            <div className="bg-white rounded-lg p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">{category === 'bike' ? 'Bike' : 'Car'} Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                { category === 'bike' && (<div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Title <span className="text-red-600">*</span></label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g. Canyon Mountain Bike"
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#FF6B7A]"
                    required={category === 'bike'}
                  />
                </div>)}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Brand {category === 'car' && (<span className="text-red-600">*</span>)}</label>
                  <input
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    placeholder={category === 'car' ? "e.g. Ford" : "e.g. Yamaha"}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#FF6B7A]"
                    required={category === 'car'} 
                  />
                </div>
                { category === 'car' && (<div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Model <span className="text-red-600">*</span></label>
                  <input
                    type="text"
                    name="model"
                    value={formData.model}
                    onChange={handleInputChange}
                    placeholder="e.g., Explorer"
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#FF6B7A]"
                    required={category === 'car'}
                  />
                </div>)}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Year {category === 'car' && (<span className="text-red-600">*</span>)}</label>
                  <input
                    type="text"
                    name="year"
                    value={formData.year}
                    onChange={handleInputChange}
                    placeholder="e.g. 2018"
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#FF6B7A]"
                    required={category === 'car'}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Price (₵) <span className="text-red-600">*</span></label>
                  <input
                    type="text"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="e.g. 17900"
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#FF6B7A]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Condition <span className="text-red-600">*</span></label>
                  <select
                    name="condition"
                    value={formData.condition}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#FF6B7A]"
                    required
                  >
                    <option value="">Select condition</option>
                    <option value="new">New</option>
                    <option value="slightly used">Slightly Used</option>
                    <option value="used">Used</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Colour</label>
                  <input
                    type="text"
                    name="colour"
                    value={formData.colour}
                    onChange={handleInputChange}
                    placeholder="e.g. Red"
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#FF6B7A]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Mileage (km) {category === 'car' && (<span className="text-red-600">*</span>)}</label>
                  <input
                    type="text"
                    name="mileage"
                    value={formData.mileage}
                    onChange={handleInputChange}
                    placeholder="e.g. 49000 км"
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#FF6B7A]"
                    required={category === 'car'}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Fuel Type {category === 'car' && (<span className="text-red-600">*</span>)}</label>
                  <select
                    name="fuelType"
                    value={formData.fuelType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#FF6B7A]"
                    required={category === 'car'}
                  >
                    <option value="">Select fuel type</option>
                    <option value="petrol">Petrol</option>
                    <option value="diesel">Diesel</option>
                    <option value="electric">Electric</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Transmission {category === 'car' && (<span className="text-red-600">*</span>)}</label>
                  <select
                    name="transmission"
                    value={formData.transmission}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#FF6B7A]"
                    required={category === 'car'}
                  >
                    <option value="">Select transmission</option>
                    <option value="manual">Manual</option>
                    <option value="automatic">Automatic</option>
                  </select>
                </div>
                 {category === 'car' && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Body Type</label>
                    <select
                      name="bodyType"
                      value={formData.bodyType}
                      onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#FF6B7A]"
                    
                  >
                    <option value="">Select body type</option>
                    <option value="sedan">Sedan</option>
                    <option value="suv">SUV</option>
                    <option value="hatchback">Hatchback</option>
                    <option value="coupe">Coupe</option>
                    <option value="convertible">Convertible</option>
                    <option value="wagon">Wagon</option>
                    <option value="van">Van</option>
                    <option value="pickup">Pickup</option>
                  </select>
                </div>)}
                {category === 'car' && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Engine Size</label>
                    <input
                      type="text"
                      name="engine"
                      value={formData.engine}
                    onChange={handleInputChange}
                    placeholder="e.g., 3.5 diesel"
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#FF6B7A]"
                    required={false}
                  />
                </div>)}
                {category === 'car' && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">VIN</label>
                    <input
                      type="text"
                      name="VIN"
                      value={formData.VIN}
                      onChange={handleInputChange}
                      placeholder="e.g. 1HGCM82633A004352"
                      className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#FF6B7A]"
                      required={false}
                    />
                  </div>)}
                {category === 'bike' && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Gear Count</label>
                    <input
                      type="text"
                      name="gearCount"
                      value={formData.gearCount}
                    onChange={handleInputChange}
                    placeholder="e.g. 21"
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#FF6B7A]"
                    required={false}
                  />
                </div>)}
                {category === 'bike' && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Frame Material</label>
                    <select
                      name="frameMaterial"
                      value={formData.frameMaterial}
                      onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#FF6B7A]"
                    required={false}
                  >
                    <option value="">Select frame material</option>
                    <option value="steel">Steel</option>
                    <option value="aluminum">Aluminum</option>
                    <option value="carbon">Carbon</option>
                  </select>
                </div>)}
                {category === 'bike' && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Bike Type</label>
                    <select
                      name="bikeType"
                      value={formData.bikeType}
                      onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#FF6B7A]"
                    required={false}
                  >
                    <option value="">Select bike type</option>
                    <option value="mountain">Mountain</option>
                    <option value="road">Road</option>
                    <option value="hybrid">Hybrid</option>
                    <option value="electric">Electric</option>
                  </select>
                </div>)}
                {category === 'bike' && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Brake Type</label>
                    <select
                      name="brakeType"
                      value={formData.brakeType}
                      onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#FF6B7A]"
                    required={false}
                  >
                    <option value="">Select brake type</option>
                    <option value="disc">Disc</option>
                    <option value="rim">Rim</option>
                  </select>
                </div>)}
              </div>
            </div>

            {/* Location */}
            <div className="bg-white rounded-lg p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Location <span className="text-red-600">*</span></h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Region
              </label>
              <select
                name="region"
                value={locationData.region}
                onChange={handleLocationChange}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#FF6B7A]"
                required
              >
                  <option value="">Select region</option>
                  {Object.keys(regionsAndTowns).map((region) => (
                    <option key={region} value={region}>
                      {region}
                    </option>
                ))}
              </select>
            </div>

            {/* Town Dropdown */}
            {/* {locationData.region && ( */}
              <div className="">
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Town
                </label>

                <select
                  name="town"
                  value={locationData.town}
                  onChange={handleLocationChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#FF6B7A]"
                  required
                >
                  <option value="">Select town</option>

                  {regionsAndTowns[locationData.region]?.map((town) => (
                    <option key={town} value={town}>
                      {town}
                    </option>
                  ))}

                  <option value="other">Other</option>
                </select>
              </div>
            {/* )} */}

            {/* Other Town Input */}
            {locationData.town === "other" && (
              <div className="mt-4">
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Enter Town
                </label>
                <input
                  type="text"
                  name="otherTown"
                  value={locationData.otherTown}
                  onChange={handleLocationChange}
                  placeholder="Enter your town"
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#FF6B7A]"
                  required
                />
              </div>
            )}
            </div>
                        </div>

            
            {/* Description */}
            <div className="bg-white rounded-lg p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Description</h2>
              <label className="block text-sm font-semibold text-gray-900 mb-2">{category === 'car' ? 'Car' : 'Bike'} Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe the condition, history, and features of your vehicle..."
                rows={5}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#FF6B7A]"
              />
            </div>

            {/* Features */}
            <div className="bg-white rounded-lg p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Features</h2>
              <div className="flex-col gap-3">
                <div className="flex gap-3 mb-4">
                <input
                    type="text"
                    name="features"
                    value={feature}
                    onChange={(e) => setFeature(e.target.value)}
                    placeholder={category === 'car' ? 'e.g. Reverse Camera' : 'e.g. Disc Brakes'}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#FF6B7A]"
                />
                <button 
                  type="button"
                  onClick={handleAddFeature}
                  disabled={feature.trim() === ''}
                  className={`${feature.trim() === '' ? 'disabled' : ''} bg-[#FF6B7A] hover:bg-[#FF5566] text-white flex gap-2 px-4 py-2 rounded font-semibold transition-colors`}
                >
                  <Plus className='w-6 h-6' />
                  Add
                </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {featureData.map(feature => (
                    <div key={feature} className="inline-flex items-center gap-2 mt-2 rounded-full bg-red-50 px-3 py-1 ">
                      <span className="text-sm text-gray-700 capitalize">{feature}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(feature)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>    
            </div>

            {/* Images */}

            <div className="bg-white rounded-2xl p-8 shadow-sm border">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Images (Max 5) <span className="text-red-600">*</span></h2>
              <div className="space-y-4">
              
                  {/* Upload Button */}
                  <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-[#FF6B7A] transition">
                    <div className="text-center">
                      <p className="text-gray-500 font-medium">Click to upload</p>
                      <p className="text-xs text-gray-400">PNG, JPG (Max 1MB)</p>
                    </div>

                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>

                  {/* Error */}
                  {error && (
                    <p className="text-red-500 text-sm">{error}</p>
                  )}

                  {/* Image Preview Grid */}
                  {images.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {images.map((img, index) => (
                        <div
                          key={index}
                          className={`relative rounded-xl overflow-hidden border ${
                          coverIndex === index
                            ? "border-[#FF6B7A] ring-2 ring-[#FF6B7A]"
                            : "border-gray-200"
                          }`}
                        >

                          {/* Image */}
                          <img
                            src={img.preview}
                            alt="preview"
                            className="w-full h-32 object-cover"
                          />

      

                          {/* Cover Badge */}
                          {coverIndex === index && (
                            <span className="absolute top-2 left-2 bg-[#FF6B7A] text-white text-xs px-2 py-1 rounded">
                              Cover
                            </span>
                          )}

                          {/* ACTIONS */}
                          <div className="absolute bottom-0 left-0 right-0 p-2 flex gap-2 justify-center bg-black/60 transition">

                            <button
                              type="button"
                              onClick={() => setCoverIndex(index)}
                              className="bg-white text-xs px-2 py-1 rounded-md font-medium"
                            >
                              Cover
                            </button>

                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="bg-red-500 text-white text-xs px-2 py-1 rounded-md"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4 justify-end">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-2 border border-gray-300 rounded text-gray-900 font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-[#FF6B7A] hover:bg-[#FF5566] text-white rounded font-semibold transition-colors"
              >
                {loading ? "Posting..." : `Post ${category === 'car' ? 'Car' : 'Bike'}`}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
