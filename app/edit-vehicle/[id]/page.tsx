'use client'

import { Header }                    from '@/components/header'
import { validateVehicleForm }       from '@/utils/postValidation'
import { updateVehicle }             from '@/utils/vehicles/updateVehicle'
import { ArrowLeft, Car, Bike, Plus, Trash, Loader2 } from 'lucide-react'
import { useRouter, useParams }      from 'next/navigation'
import { useEffect, useState }       from 'react'
import { doc, getDoc }               from 'firebase/firestore'
import { db }                        from '@/lib/firebase'
import { useAppStore } from '@/store/app-store'
import { showToast } from '@/context/ShowToast'

type ImageItem =
  | { type: 'existing'; url: string; preview: string }
  | { type: 'new';      file: File;  preview: string }

const regionsAndTowns: Record<string, string[]> = {
  'Greater Accra': ['Accra', 'Tema', 'Lapaz', 'Madina', 'Kasoa'],
  'Ashanti':       ['Kumasi', 'Obuasi', 'Ejisu'],
}

const initialFormData = {
  title:         '',
  year:          '',
  brand:         '',
  model:         '',
  condition:     '',
  mileage:       '',
  price:         '',
  fuelType:      '',
  transmission:  '',
  engine:        '',
  description:   '',
  gearCount:     '',
  VIN:           '',
  colour:        '',
  frameMaterial: '',
  brakeType:     '',
  bikeType:      '',
  bodyType:      '',
}

export default function EditVehiclePage() {
  const router    = useRouter()
  const params    = useParams()
  const vehicleId = params.id as string
  const user      = useAppStore((state) => state.user)
  const isAdmin = user?.role === 'admin'

  const [category,     setCategory]     = useState<'car' | 'bike'>('car')
  const [formData,     setFormData]     = useState(initialFormData)
  const [locationData, setLocationData] = useState({ region: '', town: '', otherTown: '' })
  const [featureData,  setFeatureData]  = useState<string[]>([])
  const [feature,      setFeature]      = useState('')
  const [images,       setImages]       = useState<ImageItem[]>([])
  const [coverIndex,   setCoverIndex]   = useState<number | null>(null)
  const [error,        setError]        = useState('')
  const [loading,      setLoading]      = useState(false)
  const [fetching,     setFetching]     = useState(true)

  // ── Fetch existing vehicle data ──────────────────────────────
  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const snap = await getDoc(doc(db, 'listings', vehicleId))
        if (!snap.exists()) { router.push('/main'); return }

        const d = snap.data()

        // Guard — only the owner can edit
        if (!isAdmin) { router.push('/main'); showToast("You are not an admin.", "error"); return }

        setCategory(d.category ?? 'car')

        setFormData({
          title:         d.title         ?? '',
          year:          d.year          ?? '',
          brand:         d.brand         ?? '',
          model:         d.model         ?? '',
          condition:     d.condition     ?? '',
          mileage:       d.mileage       ?? '',
          price:         d.price         ?? '',
          fuelType:      d.fuelType      ?? '',
          transmission:  d.transmission  ?? '',
          engine:        d.engine        ?? '',
          description:   d.description   ?? '',
          gearCount:     d.gearCount     ?? '',
          VIN:           d.VIN           ?? '',
          colour:        d.colour        ?? '',
          frameMaterial: d.frameMaterial ?? '',
          brakeType:     d.brakeType     ?? '',
          bikeType:      d.bikeType      ?? '',
          bodyType:      d.bodyType      ?? '',
        })

        setLocationData({
          region:    d.location?.region    ?? '',
          town:      d.location?.town      ?? '',
          otherTown: d.location?.otherTown ?? '',
        })

        setFeatureData(d.features ?? [])

        // Map existing image URLs into ImageItem shape
        const existingImages: ImageItem[] = (d.images ?? []).map((url: string) => ({
          type:    'existing',
          url,
          preview: url,
        }))
        setImages(existingImages)

        // Cover is the first image by default
        setCoverIndex(d.coverIndex ?? 0)
      } catch (error: any) {
        console.error(error.message)
      } finally {
        setFetching(false)
      }
    }

    if (vehicleId && user) fetchVehicle()
  }, [vehicleId, user])

  // ── Handlers ─────────────────────────────────────────────────
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleLocationChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target
    if (name === 'region') {
      setLocationData({ region: value, town: '', otherTown: '' })
    } else {
      setLocationData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setError('')

    if (images.length + files.length > 5) {
      setError('You can only have up to 5 images.')
      return
    }

    const newImages: ImageItem[] = []

    files.forEach((file) => {
      if (file.size > 1024 * 1024) {
        setError('Each image must be less than 1MB.')
        return
      }
      newImages.push({ type: 'new', file, preview: URL.createObjectURL(file) })
    })

    setImages((prev) => [...prev, ...newImages])

    if (coverIndex === null && newImages.length > 0) {
      setCoverIndex(0)
    }
  }

  const removeImage = (index: number) => {
    setImages((prev) => {
      const updated = prev.filter((_, i) => i !== index)
      if (updated.length === 0)                          setCoverIndex(null)
      else if (coverIndex === index)                     setCoverIndex(0)
      else if (coverIndex !== null && index < coverIndex) setCoverIndex(coverIndex - 1)
      return updated
    })
  }

  const handleAddFeature = () => {
    if (feature.trim() !== '') {
      setFeatureData((prev) => [...prev, feature.trim()])
      setFeature('')
    }
  }

  const handleRemoveFeature = (f: string) => {
    setFeatureData((prev) => prev.filter((item) => item !== f))
  }

  // ── Submit ────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (coverIndex === null) return

    const isValid = validateVehicleForm(
      { ...formData, features: featureData, location: locationData, images, coverIndex },
      category
    )
    if (!isValid) return

    setLoading(true)
    try {
      await updateVehicle(
        vehicleId,
        { ...formData, features: featureData, location: locationData },
        images,
        coverIndex,
        category
      )
      router.push(`/vehicles/${vehicleId}`)
    } catch (error: any) {
      console.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  // ── Loading skeleton ──────────────────────────────────────────
  if (fetching) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto p-6 w-full flex flex-col gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white rounded-lg p-8 h-48 animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-6">

          {/* Page header */}
          <div className="mb-8">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-[#FF6B7A] hover:text-[#FF5566] font-semibold mb-4"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Edit Vehicle</h1>
            <p className="text-gray-600 mt-2">Update the details of your listing</p>
          </div>

          {/* Category toggle */}
          <div className="flex gap-4 mb-6">
            <button
              type="button"
              onClick={() => setCategory('car')}
              className={`${
                category === 'car'
                  ? 'bg-[#FF6B7A] hover:bg-[#FF5566] text-white'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-500'
              } flex gap-2 px-4 py-2 rounded-lg font-semibold transition-colors`}
            >
              <Car className="w-5 h-5" /> Car
            </button>
            <button
              type="button"
              onClick={() => setCategory('bike')}
              className={`${
                category === 'bike'
                  ? 'bg-[#FF6B7A] hover:bg-[#FF5566] text-white'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-500'
              } flex gap-2 px-4 py-2 rounded-lg font-semibold transition-colors`}
            >
              <Bike className="w-5 h-5" /> Bike
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">

            {/* Vehicle details */}
            <div className="bg-white rounded-lg p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                {category === 'bike' ? 'Bike' : 'Car'} Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {category === 'bike' && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Title <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="e.g. Canyon Mountain Bike"
                      className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#FF6B7A]"
                      required={category === 'bike'}
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Brand {category === 'car' && <span className="text-red-600">*</span>}
                  </label>
                  <input
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    placeholder={category === 'car' ? 'e.g. Ford' : 'e.g. Yamaha'}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#FF6B7A]"
                    required={category === 'car'}
                  />
                </div>

                {category === 'car' && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Model <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      name="model"
                      value={formData.model}
                      onChange={handleInputChange}
                      placeholder="e.g. Explorer"
                      className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#FF6B7A]"
                      required={category === 'car'}
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Year {category === 'car' && <span className="text-red-600">*</span>}
                  </label>
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
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Price (₵) <span className="text-red-600">*</span>
                  </label>
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
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Condition <span className="text-red-600">*</span>
                  </label>
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
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Mileage (km) {category === 'car' && <span className="text-red-600">*</span>}
                  </label>
                  <input
                    type="text"
                    name="mileage"
                    value={formData.mileage}
                    onChange={handleInputChange}
                    placeholder="e.g. 49000 km"
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#FF6B7A]"
                    required={category === 'car'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Fuel Type {category === 'car' && <span className="text-red-600">*</span>}
                  </label>
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
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Transmission {category === 'car' && <span className="text-red-600">*</span>}
                  </label>
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
                  </div>
                )}

                {category === 'car' && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Engine Size</label>
                    <input
                      type="text"
                      name="engine"
                      value={formData.engine}
                      onChange={handleInputChange}
                      placeholder="e.g. 3.5 diesel"
                      className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#FF6B7A]"
                    />
                  </div>
                )}

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
                    />
                  </div>
                )}

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
                    />
                  </div>
                )}

                {category === 'bike' && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Frame Material</label>
                    <select
                      name="frameMaterial"
                      value={formData.frameMaterial}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#FF6B7A]"
                    >
                      <option value="">Select frame material</option>
                      <option value="steel">Steel</option>
                      <option value="aluminum">Aluminum</option>
                      <option value="carbon">Carbon</option>
                    </select>
                  </div>
                )}

                {category === 'bike' && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Bike Type</label>
                    <select
                      name="bikeType"
                      value={formData.bikeType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#FF6B7A]"
                    >
                      <option value="">Select bike type</option>
                      <option value="mountain">Mountain</option>
                      <option value="road">Road</option>
                      <option value="hybrid">Hybrid</option>
                      <option value="electric">Electric</option>
                    </select>
                  </div>
                )}

                {category === 'bike' && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Brake Type</label>
                    <select
                      name="brakeType"
                      value={formData.brakeType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#FF6B7A]"
                    >
                      <option value="">Select brake type</option>
                      <option value="disc">Disc</option>
                      <option value="rim">Rim</option>
                    </select>
                  </div>
                )}
              </div>
            </div>

            {/* Location */}
            <div className="bg-white rounded-lg p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Location <span className="text-red-600">*</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Region</label>
                  <select
                    name="region"
                    value={locationData.region}
                    onChange={handleLocationChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#FF6B7A]"
                    required
                  >
                    <option value="">Select region</option>
                    {Object.keys(regionsAndTowns).map((region) => (
                      <option key={region} value={region}>{region}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Town</label>
                  <select
                    name="town"
                    value={locationData.town}
                    onChange={handleLocationChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#FF6B7A]"
                    required
                  >
                    <option value="">Select town</option>
                    {regionsAndTowns[locationData.region]?.map((town) => (
                      <option key={town} value={town}>{town}</option>
                    ))}
                    <option value="other">Other</option>
                  </select>
                </div>

                {locationData.town === 'other' && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Enter Town</label>
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
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                {category === 'car' ? 'Car' : 'Bike'} Description
              </label>
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
                    value={feature}
                    onChange={(e) => setFeature(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddFeature() }}}
                    placeholder={category === 'car' ? 'e.g. Reverse Camera' : 'e.g. Disc Brakes'}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#FF6B7A]"
                  />
                  <button
                    type="button"
                    onClick={handleAddFeature}
                    disabled={feature.trim() === ''}
                    className="bg-[#FF6B7A] hover:bg-[#FF5566] text-white flex gap-2 px-4 py-2 rounded font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Plus className="w-6 h-6" /> Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {featureData.map((f) => (
                    <div key={f} className="inline-flex items-center gap-2 mt-2 rounded-full bg-red-50 px-3 py-1">
                      <span className="text-sm text-gray-700 capitalize">{f}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(f)}
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
              <h2 className="text-xl font-bold text-gray-900 mb-2">Images (Max 5) <span className="text-red-600">*</span></h2>
              <p className="text-sm text-gray-500 mb-6">
                Existing images are shown below. Upload new ones or remove any you want to replace.
              </p>

              <div className="space-y-4">
                {images.length < 5 && (
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
                )}

                {error && <p className="text-red-500 text-sm">{error}</p>}

                {images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {images.map((img, index) => (
                      <div
                        key={index}
                        className={`relative rounded-xl overflow-hidden border ${
                          coverIndex === index
                            ? 'border-[#FF6B7A] ring-2 ring-[#FF6B7A]'
                            : 'border-gray-200'
                        }`}
                      >
                        <img
                          src={img.preview}
                          alt="preview"
                          className="w-full h-32 object-cover"
                        />

                        {/* Existing badge */}
                        {img.type === 'existing' && coverIndex !== index && (
                          <span className="absolute top-2 left-2 bg-gray-800/70 text-white text-xs px-2 py-1 rounded">
                            Saved
                          </span>
                        )}

                        {coverIndex === index && (
                          <span className="absolute top-2 left-2 bg-[#FF6B7A] text-white text-xs px-2 py-1 rounded">
                            Cover
                          </span>
                        )}

                        <div className="absolute bottom-0 left-0 right-0 p-2 flex gap-2 justify-center bg-black/60">
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

            {/* Submit buttons */}
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
                disabled={loading}
                className="flex items-center gap-2 px-6 py-2 bg-[#FF6B7A] hover:bg-[#FF5566] text-white rounded font-semibold transition-colors disabled:opacity-60"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {loading ? 'Saving...' : `Save changes`}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}