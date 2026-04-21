const STORAGE_KEY = 'tt-cart-v1';
const EVENT_NAME = 'cart-changed';

type CartListener = (ids: string[]) => void;

function read(): string[] {
  if (typeof localStorage === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((x): x is string => typeof x === 'string');
  } catch {
    return [];
  }
}

function write(ids: string[]): void {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  emit(ids);
}

function emit(ids: string[]): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { ids } }));
}

export function getCart(): string[] {
  return read();
}

export function getCartCount(): number {
  return read().length;
}

export function isInCart(id: string): boolean {
  return read().includes(id);
}

export function addToCart(id: string): string[] {
  if (!id) return read();
  const current = read();
  if (current.includes(id)) return current;
  const next = [...current, id];
  write(next);
  return next;
}

export function removeFromCart(id: string): string[] {
  const next = read().filter((x) => x !== id);
  write(next);
  return next;
}

export function removeManyFromCart(ids: string[]): string[] {
  const set = new Set(ids);
  const next = read().filter((x) => !set.has(x));
  write(next);
  return next;
}

export function clearCart(): void {
  write([]);
}

/**
 * Subscribe to cart changes. Fires on same-tab changes (CustomEvent) and
 * cross-tab changes (storage event). Returns an unsubscribe function.
 */
export function subscribeToCart(fn: CartListener): () => void {
  if (typeof window === 'undefined') return () => {};

  const onChange = (e: Event) => {
    const ids = (e as CustomEvent<{ ids: string[] }>).detail?.ids ?? read();
    fn(ids);
  };
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) fn(read());
  };

  window.addEventListener(EVENT_NAME, onChange);
  window.addEventListener('storage', onStorage);
  return () => {
    window.removeEventListener(EVENT_NAME, onChange);
    window.removeEventListener('storage', onStorage);
  };
}
