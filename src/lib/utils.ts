import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { 
  formatDate, 
  formatDateTime, 
  formatTime, 
  formatNumber, 
  formatRupiah,
  parseFormattedNumber
} from "@/utils/formatters";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Re-export common formatters for backward compatibility
export { 
  formatDate, 
  formatDateTime, 
  formatTime, 
  formatNumber, 
  formatRupiah,
  parseFormattedNumber
};

// Generate unique ID with prefix
export function generateId(prefix: string = "ID"): string {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 8);
  return `${prefix}_${timestamp}_${randomStr}`;
}

// Capitalize first letter
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Truncate text with ellipsis
export function truncate(text: string, length: number): string {
  return text.length > length ? `${text.substring(0, length)}...` : text;
}

// Generate random string
export function generateRandomString(length: number = 8): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Validate email format
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validate Indonesian phone number
export function isValidPhoneNumber(phone: string): boolean {
  const phoneRegex = /^(\+62|62|0)8[1-9][0-9]{6,9}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

// Format phone number to Indonesian format
export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('0')) {
    return `+62${cleaned.slice(1)}`;
  } else if (cleaned.startsWith('62')) {
    return `+${cleaned}`;
  } else if (cleaned.startsWith('8')) {
    return `+62${cleaned}`;
  }
  return phone;
}

// Calculate percentage
export function calculatePercentage(value: number, total: number): number {
  return total === 0 ? 0 : (value / total) * 100;
}

// Format percentage
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

// Deep clone object
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

// Check if object is empty
export function isEmpty(obj: any): boolean {
  return obj === null || obj === undefined || 
         (typeof obj === 'object' && Object.keys(obj).length === 0) ||
         (typeof obj === 'string' && obj.trim() === '') ||
         (Array.isArray(obj) && obj.length === 0);
}

// Debounce function
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Format file size
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
