// Auto-discovers all images in src/assets/images/{productId}/
// File names and extensions are irrelevant — anything in the folder gets picked up.

const allImages = import.meta.glob(
  '../assets/images/**/*.{png,PNG,jpg,JPG,jpeg,JPEG,gif,GIF,webp,WEBP,svg,SVG}',
  { eager: true, query: '?url', import: 'default' }
) as Record<string, string>;

function imagesForProduct(productId: string): string[] {
  return Object.entries(allImages)
    .filter(([path]) => {
      const parts = path.split('/');
      // parts: ['..', 'assets', 'images', productId, 'filename']
      return parts[parts.length - 2] === productId;
    })
    .sort(([a], [b]) => a.localeCompare(b, undefined, { sensitivity: 'base' }))
    .map(([, url]) => url);
}

export function getProductScreenshots(productId: string): string[] {
  return imagesForProduct(productId).filter(
    (_, _i, arr) => arr.length > 0
  );
}
