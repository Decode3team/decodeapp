import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumber(value: number) {
  const suffixes = ['', 'K', 'M', 'B', 'T'];

  let suffixIndex = 0;
  while (value >= 1000 && suffixIndex < suffixes.length - 1) {
    value /= 1000;
    suffixIndex++;
  }

  const roundedToNearestTenth = Math.round(value * 10) / 10; 
  const formattedValue = Number.isInteger(roundedToNearestTenth) ? roundedToNearestTenth.toFixed(0) : roundedToNearestTenth.toFixed(1);
  
  return formattedValue + suffixes[suffixIndex];
}

type QueryParams = {
  [key: string]: string | number | boolean | undefined;
};

export function generateQueryString<T extends QueryParams>(params: T): string {
  const queryStringArray: string[] = [];

  for (const [key, value] of Object.entries(params)) {
    if (value !== null && value !== undefined) {
      queryStringArray.push(`${key}=${encodeURIComponent(String(value))}`);
    }
  }

  return queryStringArray.join('&');
}