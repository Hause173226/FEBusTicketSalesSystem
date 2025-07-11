import { format, parseISO } from 'date-fns';
import { vi } from 'date-fns/locale';

/**
 * Format date string to Vietnamese format
 * @param dateString - Date string in various formats
 * @param formatPattern - Date format pattern (default: 'EEEE, dd/MM/yyyy')
 * @returns Formatted date string or fallback value
 */
export const formatDate = (
  dateString: string | null | undefined, 
  formatPattern: string = 'EEEE, dd/MM/yyyy'
): string => {
  if (!dateString) return 'Chưa xác định';
  
  try {
    let date: Date;
    
    // Nếu dateString là định dạng ISO hoặc có thể parse được
    if (dateString.includes('T') || dateString.includes('-')) {
      date = parseISO(dateString);
    } else {
      // Nếu là định dạng khác, thử parse trực tiếp
      date = new Date(dateString);
    }
    
    // Kiểm tra xem date có hợp lệ không
    if (isNaN(date.getTime())) {
      return dateString; // Trả về nguyên gốc nếu không parse được
    }
    
    return format(date, formatPattern, { locale: vi });
  } catch (error) {
    return dateString;
  }
};

/**
 * Format date to simple Vietnamese format (dd/MM/yyyy)
 * @param dateString - Date string in various formats
 * @returns Formatted date string or fallback value
 */
export const formatDateSimple = (dateString: string | null | undefined): string => {
  if (!dateString) return 'Chưa xác định';
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'Chưa xác định';
    }
    return date.toLocaleDateString('vi-VN');
  } catch (error) {
    return 'Chưa xác định';
  }
};

/**
 * Format price to Vietnamese currency format
 * @param price - Price number
 * @returns Formatted price string
 */
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price);
};

/**
 * Format time string (HH:mm format)
 * @param timeString - Time string
 * @returns Formatted time string or fallback
 */
export const formatTime = (timeString: string | null | undefined): string => {
  if (!timeString) return 'Chưa xác định';
  return timeString;
};
