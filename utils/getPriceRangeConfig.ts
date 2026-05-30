export const getPriceRangeConfig = (vehicles: { price: number | string }[]) => {
  if (!vehicles.length) return { min: 0, max: 100000, step: 1000 }

  const maxPrice = Math.max(...vehicles.map((v) => Number(v.price)))

  // Round max up to the nearest clean number for a nicer slider range
  const getRoundedMax = (price: number): number => {
    if (price <= 0) return 100
    const magnitude = Math.pow(10, Math.floor(Math.log10(price)))
    return Math.ceil(price / magnitude) * magnitude
  }

  const getStep = (price: number): number => {
    if (price <=       100) return 1
    if (price <=     1_000) return 10
    if (price <=    10_000) return 100
    if (price <=   100_000) return 1_000
    if (price <= 1_000_000) return 10_000
    return 100_000
  }

  const roundedMax = getRoundedMax(maxPrice)
  const step       = getStep(roundedMax)

  return {
    min:  0,
    max:  roundedMax,
    step,
  }
}