import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing PUBLIC_SUPABASE_URL or PUBLIC_SUPABASE_ANON_KEY in env');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const STORAGE_BUCKET = 'product-images';

export function storageUrl(path: string): string {
  return `${supabaseUrl}/storage/v1/object/public/${STORAGE_BUCKET}/${path}`;
}

export interface Product {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  price_cents: number;
  cost_cents: number | null;
  status: string;
  length: string | null;
  meta_description: string | null;
  piece_id: string | null;
  featured: boolean;
  sold_at: string | null;
  reserved_until: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProductImage {
  id: string;
  product_id: string;
  storage_path: string;
  alt_text: string | null;
  display_order: number;
  created_at: string;
}

export interface ProductWithImages extends Product {
  product_images: ProductImage[];
}

export async function fetchPublishedProducts(): Promise<ProductWithImages[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*, product_images(*)')
    .eq('status', 'published')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data ?? []).map((p) => ({
    ...p,
    product_images: (p.product_images ?? []).sort(
      (a: ProductImage, b: ProductImage) => a.display_order - b.display_order,
    ),
  })) as ProductWithImages[];
}

export async function fetchFeaturedProducts(): Promise<ProductWithImages[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*, product_images(*)')
    .eq('status', 'published')
    .eq('featured', true)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data ?? []).map((p) => ({
    ...p,
    product_images: (p.product_images ?? []).sort(
      (a: ProductImage, b: ProductImage) => a.display_order - b.display_order,
    ),
  })) as ProductWithImages[];
}

export async function fetchProductBySlug(slug: string): Promise<ProductWithImages | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*, product_images(*)')
    .eq('slug', slug)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;
  return {
    ...data,
    product_images: (data.product_images ?? []).sort(
      (a: ProductImage, b: ProductImage) => a.display_order - b.display_order,
    ),
  } as ProductWithImages;
}

export function formatPrice(cents: number): string {
  return `$${(cents / 100).toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
}

export interface DropSettings {
  id: number;
  enabled: boolean;
  name: string | null;
  drops_at: string | null;
  location: string | null;
  shop_url: string | null;
  updated_at: string;
}

export async function fetchDropSettings(): Promise<DropSettings | null> {
  const { data, error } = await supabase
    .from('drop_settings')
    .select('*')
    .order('id', { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return (data ?? null) as DropSettings | null;
}
