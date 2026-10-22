export const SUPABASE_STORAGE_URL =
  process.env.SUPABASE_STORAGE_URL ||
  'https://wrbpnxehoumyawtdiikh.supabase.co/storage/v1/object/public/puppy.instabiz';

export function getStorageUrl(path: string): string {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${SUPABASE_STORAGE_URL}/${cleanPath}`;
}
