import { formatPrice } from './format';
import { supabase, storageUrl } from './supabase';
import { getProductImageUrl } from './image-url';

export interface CartItemData {
  id: string;
  slug: string;
  piece_id: string | null;
  title: string;
  price_cents: number;
  primary_image_url: string | null;
  length: string | null;
  turquoise_type: string | null;
  metal: string | null;
}

export interface UnavailableItem {
  id: string;
  reason: 'sold' | 'archived' | 'not_found';
  title?: string;
}

export interface ValidateResult {
  available: CartItemData[];
  unavailable: UnavailableItem[];
}

const FALLBACK_IMG = 'https://bswmrfxdadcmuyhmsagv.supabase.co/storage/v1/object/public/portfolio-images/test.jpeg';

/**
 * Client-side cart validate. Queries Supabase directly so cart/checkout
 * work without a separate `/api/cart/validate` backend.
 */
export async function validateCart(ids: string[]): Promise<ValidateResult> {
  if (!ids.length) return { available: [], unavailable: [] };

  const { data, error } = await supabase
    .from('products')
    .select('id, slug, piece_id, title, price_cents, status, sold_at, length, product_images(storage_path, display_order)')
    .in('id', ids);

  if (error || !data) {
    // Treat every requested id as not_found when Supabase is unreachable.
    return {
      available: [],
      unavailable: ids.map((id) => ({ id, reason: 'not_found' as const })),
    };
  }

  const byId = new Map(data.map((p: any) => [p.id, p]));
  const available: CartItemData[] = [];
  const unavailable: UnavailableItem[] = [];

  for (const id of ids) {
    const p = byId.get(id) as any | undefined;
    if (!p) {
      unavailable.push({ id, reason: 'not_found' });
      continue;
    }
    if (p.sold_at) {
      unavailable.push({ id, reason: 'sold', title: p.title });
      continue;
    }
    if (p.status !== 'published') {
      unavailable.push({ id, reason: 'archived', title: p.title });
      continue;
    }
    const images = Array.isArray(p.product_images) ? [...p.product_images].sort((a, b) => a.display_order - b.display_order) : [];
    const primary = images[0]?.storage_path ? storageUrl(images[0].storage_path) : null;
    available.push({
      id: p.id,
      slug: p.slug,
      piece_id: p.piece_id,
      title: p.title,
      price_cents: p.price_cents,
      primary_image_url: primary,
      length: p.length ?? null,
      turquoise_type: null,
      metal: null,
    });
  }

  return { available, unavailable };
}

export interface ValidateApiResponse {
  ok: boolean;
  data?: {
    available: CartItemData[];
    unavailable: Array<{ id: string; reason: string; title?: string }>;
  };
  error?: { code: string; message: string };
}

/**
 * Server-validated cart check. Posts to the backend at PUBLIC_API_URL so the
 * server sees the same validation context it'll use at checkout time.
 *
 * Use validateCart() for fast read-side rendering (queries Supabase directly).
 * Use validateCartViaApi() before write operations where the backend must be
 * the source of truth.
 */
export async function validateCartViaApi(productIds: string[]): Promise<ValidateApiResponse> {
  const apiBase = import.meta.env.PUBLIC_API_URL;
  try {
    const res = await fetch(`${apiBase}/api/cart/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ product_ids: productIds }),
    });
    return (await res.json()) as ValidateApiResponse;
  } catch (e) {
    return {
      ok: false,
      error: { code: 'network_error', message: 'Could not reach the server. Please try again.' },
    };
  }
}

function esc(value: unknown): string {
  if (value == null) return '';
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Full cart row — shown on /cart page. */
export function renderCartItemRow(item: CartItemData, opts: { showRemove?: boolean } = {}): string {
  const { showRemove = true } = opts;
  const specs: string[] = [];
  if (item.length) specs.push(esc(item.length));
  if (item.turquoise_type) specs.push(esc(item.turquoise_type));
  if (item.metal) specs.push(esc(item.metal));

  return `
    <article class="cart-row" data-cart-row data-id="${esc(item.id)}">
      <a class="cart-row__img" href="/products/${esc(item.slug)}" aria-label="${esc(item.title)}">
        <img src="${esc(getProductImageUrl(item.primary_image_url ?? FALLBACK_IMG, 'thumbnail'))}" alt="${esc(item.title)}" loading="lazy" decoding="async" width="200" height="200" />
      </a>
      <div class="cart-row__body">
        <div class="cart-row__head">
          <a class="cart-row__title" href="/products/${esc(item.slug)}">${esc(item.title)}</a>
          <span class="cart-row__price">${formatPrice(item.price_cents)}</span>
        </div>
        ${item.piece_id ? `<div class="cart-row__id">Piece ${esc(item.piece_id)}</div>` : ''}
        ${specs.length ? `<div class="cart-row__specs">${specs.join(' <span aria-hidden="true">·</span> ')}</div>` : ''}
        ${showRemove ? `<button type="button" class="cart-row__remove" data-remove="${esc(item.id)}">Remove</button>` : ''}
      </div>
    </article>
  `;
}

/** Condensed summary row — shown in checkout + success order summary. */
export function renderSummaryRow(item: CartItemData): string {
  return `
    <div class="summary-row">
      <div class="summary-row__img">
        <img src="${esc(getProductImageUrl(item.primary_image_url ?? FALLBACK_IMG, 'thumbnail'))}" alt="" loading="lazy" decoding="async" width="200" height="200" />
      </div>
      <div class="summary-row__body">
        <div class="summary-row__title">${esc(item.title)}</div>
        ${item.piece_id ? `<div class="summary-row__id">Piece ${esc(item.piece_id)}</div>` : ''}
      </div>
      <div class="summary-row__price">${formatPrice(item.price_cents)}</div>
    </div>
  `;
}

export function sumCents(items: CartItemData[]): number {
  return items.reduce((acc, it) => acc + (it.price_cents ?? 0), 0);
}
