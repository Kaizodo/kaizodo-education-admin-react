import { DropdownItemType } from "@/components/common/Dropdown";
import { clsx, type ClassValue } from "clsx"
import moment, { Moment } from "moment";
import { twMerge } from "tailwind-merge"
import tinycolor from "tinycolor2";

export function formatDate(date: string) {
  return moment(date).format('DD MMM, Y');
}

export function formatTime(time: string, inputFormat = 'HH:mm:ss') {
  return moment(time, inputFormat).format('LT');
}

export function formatDateTime(datetime: string) {
  return moment(datetime).format('DD MMM, Y LT');
}



export function copyToClipboard(value: string) {
  if (navigator.clipboard && window.isSecureContext) {
    // Modern approach
    navigator.clipboard.writeText(value)
      .then(() => console.log('Copied to clipboard!'))
      .catch(err => console.error('Failed to copy: ', err));
  } else {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = value;
    textArea.style.position = 'fixed';  // Avoid scrolling to bottom
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      console.log('Copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
    document.body.removeChild(textArea);
  }
}



export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDays(days: number): string {
  if (days < 0) return "";

  if (days < 30) return `${days} day${days > 1 ? "s" : ""}`;

  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months > 1 ? "s" : ""}`;

  const years = Math.floor(days / 365);
  return `${years} year${years > 1 ? "s" : ""}`;
}

export function calculatePrice(form: { price?: number | null; discount?: number | null }) {
  const original_price = form.price && form.price > 0 ? form.price : 0;
  const discount_amount = form.discount && form.discount > 0 ? form.discount : 0;

  const discounted_price =
    original_price > 0 && discount_amount > 0
      ? +(original_price - (original_price * discount_amount) / 100).toFixed(2)
      : original_price;

  const saved_amount =
    original_price > 0 && discounted_price < original_price
      ? +(original_price - discounted_price).toFixed(2)
      : 0;

  return {
    original_price,
    discounted_price,
    discount_amount,
    saved_amount,
  };
}


export function getMonthMoments(d1: string | Moment, d2: string | Moment): Moment[] {
  const start = moment(d1).startOf('month');
  const end = moment(d2).startOf('month');
  const months: Moment[] = [];

  while (start.isSameOrBefore(end, 'month')) {
    months.push(start.clone());
    start.add(1, 'month');
  }

  return months;
}

export const formatBytes = (bytes: number): string => {
  if (bytes >= 1024 * 1024 * 1024) {
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
  } else if (bytes >= 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  } else {
    return `${Math.round(bytes / 1024)} KB`;
  }
}

export const delay = (ms: number = 0): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const downloadFile = async (url: string, filename = 'download') => {
  try {
    // Initial HEAD request to get file size if available
    const headResponse = await fetch(url, { method: 'HEAD', mode: 'cors' });
    const contentLength = headResponse.headers.get('content-length');
    const fileSize = contentLength ? parseInt(contentLength, 10) : null;
    const sizeThreshold = 10 * 1024 * 1024; // 10MB threshold

    const contentDisposition = headResponse.headers.get('content-disposition');
    const defaultFilename = contentDisposition?.match(/filename="(.+)"/)?.[1] || filename;

    const a = document.createElement('a');

    if (fileSize && fileSize < sizeThreshold) {
      const response = await fetch(url, { mode: 'cors' });
      if (!response.ok) throw new Error('Network response was not ok');
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      a.href = blobUrl;
      a.download = defaultFilename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(blobUrl);
    } else {
      a.href = url;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  } catch (error) {
    console.error('Download failed:', error);
    const a = document.createElement('a');
    a.href = url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
};

export const getMainDomain = (): string => {
  const host = window.location.hostname;
  const parts = host.split('.');
  if (parts.length <= 2) {
    return host;
  }
  return parts.slice(-3).join('.');
}

export const getDateForDay = (day: string, date: string): string => {
  const validDays = moment.weekdays();
  if (!validDays.includes(day) || !moment(date, 'YYYY-MM-DD', true).isValid()) {
    return '';
  }

  const inputDate = moment(date);
  const targetDayIndex = validDays.indexOf(day);
  const currentDayIndex = inputDate.day();

  const diff = targetDayIndex - currentDayIndex;
  return inputDate.add(diff, 'days').format('YYYY-MM-DD');
};

export function strToSlug(text: string): string {
  if (!text) {
    return '';
  }
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export const getWeekRange = (date: string) => {
  const m = moment(date);
  return {
    start: m.clone().startOf('week'),
    end: m.clone().endOf('week')
  };
}

export const getImageObjectUrl = (file: File) => {
  return new Promise(r => {
    const fr = new FileReader()
    fr.onload = () => r(URL.createObjectURL(file))
    fr.onerror = () => r(null)
    fr.readAsDataURL(file)
  })
}

export const nameLetter = (str: string | undefined) => {
  if (str) return str.charAt(0).toUpperCase();
  return '';
};


export const padInt = (num: number, size: number) => num.toString().padStart(size, '0');


export const isJson = (str: any) => {
  if (typeof str !== 'string') {
    return false;
  }
  try {
    JSON.parse(str);
    return true;
  } catch {
    return false;
  }
}


export const getUniqueID = (() => {
  let counter = 0
  return () => ++counter
})()


export const base64ToObjectURL = (base64: string) => {
  const byteString = atob(base64.split(',')[1]);
  const mimeString = base64.split(',')[0].split(':')[1].split(';')[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  const blob = new Blob([ab], { type: mimeString });
  return URL.createObjectURL(blob);
}

export function pickImageVirtually(): Promise<File | null> {
  return new Promise((resolve) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.style.display = 'none'
    input.onchange = () => resolve(input.files?.[0] || null)
    document.body.appendChild(input)
    input.click()
    document.body.removeChild(input)
  })
}

export function pickFileVirtually(multiple?: boolean): Promise<FileList> {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = !!multiple;
    input.accept = 'image/*,video/*,audio/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    input.style.display = 'none';
    input.onchange = () => {
      if (input.files) {
        resolve(input.files)
      }
    };
    document.body.appendChild(input);
    input.click();
    document.body.removeChild(input);
  });
}

export function getColorShadePercent(hex: string, percent: number): string {
  // remove #
  hex = hex.replace(/^#/, '');

  // expand shorthand (e.g. "03F") to full form ("0033FF")
  if (hex.length === 3) {
    hex = hex.split('').map(c => c + c).join('');
  }

  const num = parseInt(hex, 16);
  let r = (num >> 16) & 255;
  let g = (num >> 8) & 255;
  let b = num & 255;

  // percent > 0 → lighter, percent < 0 → darker
  r = Math.min(255, Math.max(0, r + (r * percent) / 100));
  g = Math.min(255, Math.max(0, g + (g * percent) / 100));
  b = Math.min(255, Math.max(0, b + (b * percent) / 100));

  return `#${((1 << 24) + (Math.round(r) << 16) + (Math.round(g) << 8) + Math.round(b))
    .toString(16)
    .slice(1)}`;
}


export function getColorShade(color: string, mode: 'dark' | 'light'): string {
  const c = tinycolor(color);

  if (!c.isValid()) {
    return mode === 'dark' ? '#555555' : '#dddddd';
  }

  return mode === 'dark' ? c.darken(20).toString() : c.lighten(20).toString();
}

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0
  }).format(amount);
};

export function generateDateRangeMap(startDate: string, endDate: string): DropdownItemType[] {
  const start = moment(startDate);
  const end = moment(endDate);
  const dates: DropdownItemType[] = [];

  while (start.isSameOrBefore(end)) {
    dates.push({
      id: start.format("YYYY-MM-DD"),
      name: start.format("DD MMM, Y"),
    });
    start.add(1, "day");
  }

  return dates;
}