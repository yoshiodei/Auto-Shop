/**
 * Formats a number as a price string with commas and 2 decimal places.
 * @param {number | string} price
 * @returns {string} e.g. "37,000.00", "1,222.05"
 */
export const formatPrice = (price: string | number): string  => {
  const num = typeof price === "string" ? parseFloat(price) : price;

  if (isNaN(num)) return "0";

  return num.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}