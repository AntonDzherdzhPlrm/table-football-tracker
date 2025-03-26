import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Determines if the current device is mobile
 */
export function isMobileDevice() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

/**
 * Adjusts select elements for better mobile display
 * Call this function in components that have select elements
 */
export function fixMobileSelects() {
  if (typeof window !== "undefined") {
    const selects = document.querySelectorAll("select");
    const isMobile = isMobileDevice();

    selects.forEach((select) => {
      if (isMobile) {
        // On mobile, reset some properties to ensure proper display
        select.style.webkitAppearance = "menulist";
        select.style.appearance = "menulist";

        // For iOS specifically
        if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
          select.addEventListener("focus", () => {
            document.body.scrollTop = select.getBoundingClientRect().top;
          });
        }
      }
    });
  }
}
