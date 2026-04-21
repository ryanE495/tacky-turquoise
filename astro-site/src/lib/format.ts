export function formatPrice(cents: number): string {
  if (cents == null || Number.isNaN(cents)) return '—';
  const dollars = cents / 100;
  // Whole-dollar prices render without cents; anything with a remainder shows two decimals.
  const hasFraction = cents % 100 !== 0;
  return dollars.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: hasFraction ? 2 : 0,
    maximumFractionDigits: 2,
  });
}
