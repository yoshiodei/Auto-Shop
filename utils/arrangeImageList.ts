/**
 * Moves a specific image link to the front of the array.
 * @param {string[]} images - The array of image links
 * @param {string} imageLink - The image link to move to the front
 * @returns {string[]} A new array with the image link at the beginning
 */
export const arrangeImageList = (images: string[], imageLink: string): string[] => {
  const index = images.indexOf(imageLink);

  if (index === -1) return images; // link not found, return as-is
  if (index === 0) return images;  // already at front, no-op

  const filtered = images.filter((img) => img !== imageLink);
  return [imageLink, ...filtered];
}