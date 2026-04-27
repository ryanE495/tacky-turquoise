export type ImageSize = 'thumbnail' | 'card' | 'detail' | 'lightbox' | 'og';

const SIZE_PRESETS: Record<ImageSize, { width: number; height?: number; quality: number }> = {
  thumbnail: { width: 200, quality: 75 },
  card:      { width: 600, quality: 80 },
  detail:    { width: 1200, quality: 85 },
  lightbox:  { width: 2400, quality: 90 },
  og:        { width: 1200, height: 630, quality: 85 },
};

export function getProductImageUrl(rawUrl: string | null | undefined, size: ImageSize): string {
  if (!rawUrl) return '';

  if (rawUrl.includes('/render/image/')) return rawUrl;
  if (!rawUrl.includes('/storage/v1/object/public/')) return rawUrl;

  const preset = SIZE_PRESETS[size];
  const renderUrl = rawUrl.replace(
    '/storage/v1/object/public/',
    '/storage/v1/render/image/public/',
  );

  const params = new URLSearchParams();
  params.set('width', String(preset.width));
  if (preset.height) params.set('height', String(preset.height));
  params.set('quality', String(preset.quality));
  params.set('resize', preset.height ? 'cover' : 'contain');

  return `${renderUrl}?${params.toString()}`;
}

export const getImageUrl = getProductImageUrl;

export function getImageSrcSet(
  rawUrl: string | null | undefined,
  sizes: ImageSize[] = ['card', 'detail'],
): string {
  if (!rawUrl) return '';
  return sizes
    .map((s) => {
      const url = getProductImageUrl(rawUrl, s);
      const width = SIZE_PRESETS[s].width;
      return `${url} ${width}w`;
    })
    .join(', ');
}

