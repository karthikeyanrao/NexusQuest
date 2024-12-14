import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export const truncateAddress = (address, startChars = 6, endChars = 4) => {
  if (!address) return "";

  const truncatedAddress =
    address.substring(0, startChars) + "..." + address.slice(-endChars);

  return truncatedAddress;
};