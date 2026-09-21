import { ApartmentType } from '../types';

const fallbackPhotosByType: Record<ApartmentType, string[]> = {
  t2: [
    '/images/Dossier T2/Rendus F2/Salon 1.webp',
    '/images/Dossier T2/Rendus F2/Salon 2.webp',
    '/images/Dossier T2/Rendus F2/Cuisine 1.webp',
    '/images/Dossier T2/Rendus F2/Chambre 1.webp'
  ],
  t3: [
    '/images/Dossier T3/Salon F3 modifie/Salon 1.webp',
    '/images/Dossier T3/Salon F3 modifie/Salon 2.webp',
    '/images/Dossier T3/Rendus F3/Chambre Master 1 F3\'.webp',
    '/images/Dossier T3/Rendus F3/Cuisine 1.webp'
  ]
};

export function getApartmentFallbackPhotos(type: ApartmentType): string[] {
  return fallbackPhotosByType[type];
}

export function resolveApartmentImagePath(path: string): string {
  const normalizedPath = path
    .trim()
    .replace(/^\.?\//, '/')
    .replace('/Rendus salon F2 modifi%23U00e9/', '/Rendus salon F2 modifie/')
    .replace('/Salon F3 modifi%23U00e9/', '/Salon F3 modifie/')
    .replace("/Rendus F3'/", '/Rendus F3/')
    .replace('/Entree.webp', '/Entr#U00e9e.webp');

  return normalizedPath
    .split('/')
    .map((segment, index) => index === 0 ? segment : encodeURIComponent(decodeURIComponent(segment)))
    .join('/');
}

export function apartmentImageSources(type: ApartmentType, photos: string[]): string[] {
  const sourcePhotos = photos.length > 0 ? photos : getApartmentFallbackPhotos(type);
  return sourcePhotos.map(resolveApartmentImagePath);
}