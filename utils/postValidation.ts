import { showToast } from "@/context/ShowToast";

type ValidationResult = {
  isValid: boolean;
  error?: string;
};

export const validateVehicleForm = (data: any, category: 'car' | 'bike'): ValidationResult => {
  const isEmpty = (value: any) =>
    value === undefined || value === null || value === "";

  const isNumber = (value: string) =>
    !isNaN(Number(value)) && value.trim() !== "";

  // Helper to stop immediately
  const fail = (message: string): ValidationResult => {
    showToast(message, 'error');
    return { isValid: false, error: message };
  };

  // ✅ REQUIRED FIELDS
  if (category === 'car') {
    if (isEmpty(data.brand)) return fail("Brand is required");
    if (isEmpty(data.model)) return fail("Model is required");
    if (isEmpty(data.year)) return fail("Year is required");
    if (isEmpty(data.mileage)) return fail("Mileage is required");
    if (isEmpty(data.fuelType)) return fail("Fuel type is required");
    if (isEmpty(data.transmission)) return fail("Transmission is required");
  }

  if (category === 'bike') {
    if (isEmpty(data.title)) return fail("Title is required");
  }
  
  if (isEmpty(data.price)) return fail("Price is required");
  if (isEmpty(data.condition)) return fail("Condition is required");
//   if (isEmpty(data.description)) return fail("Description is required");

  // ✅ LOCATION
  if (isEmpty(data.location?.region)) return fail("Region is required");
  if (isEmpty(data.location?.town)) return fail("Town is required");
  if (
    data.location?.town === "other" &&
    isEmpty(data.location?.otherTown)
  ) {
    return fail("Please enter your town");
  }

  // ✅ IMAGES
  if (!data.images || data.images.length === 0) {
    return fail("At least one image is required");
  }

  if (
    data.coverIndex === null ||
    data.coverIndex === undefined ||
    data.coverIndex < 0 ||
    data.coverIndex >= data.images.length
  ) {
    return fail("Invalid cover image");
  }

  // ✅ NUMBER VALIDATION
  if (!isNumber(data.price)) return fail("Price must be a valid number");

  if (!isEmpty(data.mileage) && !isNumber(data.mileage)) {
    return fail("Mileage must be a valid number");
  }

  if (!isEmpty(data.year) && !isNumber(data.year)) return fail("Year must be a valid number");

  if (!isEmpty(data.engine) && !isNumber(data.engine)) {
    return fail("Engine must be a valid number");
  }

  if (!isEmpty(data.gearCount) && !isNumber(data.gearCount)) {
    return fail("Gear count must be a valid number");
  }

  // ✅ FEATURES
  if (data.features && Array.isArray(data.features)) {
    const hasEmpty = data.features.some((f: string) => f.trim() === "");
    if (hasEmpty) return fail("Features cannot contain empty values");
  }

  // ✅ ALL GOOD
  return { isValid: true };
};