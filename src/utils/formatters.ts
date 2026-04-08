/**
 * Format currency in Indonesian Rupiah
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

/**
 * Format number with thousand separators
 */
export function formatNumber(number: number): string {
  return new Intl.NumberFormat('id-ID').format(number);
}

/**
 * Format percentage
 */
export function formatPercentage(value: number, decimals: number = 2): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Format date in Indonesian format
 */
export function formatDate(date: string | Date): string {
  const dateObj = new Date(date);
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(dateObj);
}

/**
 * Format datetime in Indonesian format
 */
export function formatDateTime(date: string | Date): string {
  const dateObj = new Date(date);
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(dateObj);
}

/**
 * Format number input with thousand separators - handles large numbers correctly
 */
export function formatNumberInput(value: number | string): string {
  if (!value && value !== 0) return '';
  
  const numValue = typeof value === 'string' ? parseFloat(value.replace(/[^\d.-]/g, '')) : value;
  if (isNaN(numValue) || !isFinite(numValue)) return '';
  
  // Use Indonesian locale for formatting with dots as thousand separators
  return new Intl.NumberFormat('id-ID').format(Math.floor(numValue));
}

/**
 * Clean formatted number input to get raw number - handles large numbers correctly
 */
export function cleanNumberInput(formattedValue: string): number {
  if (!formattedValue) return 0;
  
  // Remove all dots (thousand separators) and keep only digits
  const cleaned = formattedValue.replace(/\./g, '').replace(/[^\d]/g, '');
  const parsed = parseInt(cleaned, 10);
  
  if (isNaN(parsed)) return 0;
  
  return parsed;
}

/**
 * Parse formatted number string to number
 */
export function parseFormattedNumber(formattedValue: string): number {
  return cleanNumberInput(formattedValue);
}

/**
 * Validate if number is within safe range
 */
export function isValidAmountRange(value: number): boolean {
  return value >= 0 && value <= Number.MAX_SAFE_INTEGER && Number.isFinite(value);
}
