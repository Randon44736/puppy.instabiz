export const SUPABASE_STORAGE_URL =
  (import.meta as any).env?.VITE_SUPABASE_STORAGE_URL ||
  'https://wrbpnxehoumyawtdiikh.supabase.co/storage/v1/object/public/puppy.instabiz';

export function getStorageUrl(path: string): string {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${SUPABASE_STORAGE_URL}/${cleanPath}`;
}

/**
 * Rewrites any relative image paths (/images/, /brand/, /media/, /logos/)
 * in raw HTML or attributes to point directly to the Supabase storage bucket.
 */
export function rewriteHtmlImages(html: string): string {
  if (!html) return '';
  return html.replace(
    /(src|srcset|poster|href)=(["'])(\/(?:images|brand|media|logos)\/[^"']+)\2/gi,
    (_match, attr, quote, assetPath) => {
      if (attr.toLowerCase() === 'srcset') {
        const rewrittenSrcset = assetPath
          .split(',')
          .map((item: string) => {
            const trimmed = item.trim();
            const spaceIdx = trimmed.indexOf(' ');
            if (spaceIdx === -1) {
              return getStorageUrl(trimmed);
            }
            const p = trimmed.slice(0, spaceIdx);
            const d = trimmed.slice(spaceIdx);
            return `${getStorageUrl(p)}${d}`;
          })
          .join(', ');
        return `${attr}=${quote}${rewrittenSrcset}${quote}`;
      }
      return `${attr}=${quote}${getStorageUrl(assetPath)}${quote}`;
    }
  );
}
