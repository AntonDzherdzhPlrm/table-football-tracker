import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format date to a localized string: e.g. "Mar 2, 2023 at 3:45 PM"
 */
export function formatDate(date: Date | string): string {
  if (!date) return "";

  const d = typeof date === "string" ? new Date(date) : date;

  try {
    return (
      d.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      }) +
      " at " +
      d.toLocaleTimeString(undefined, {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
    );
  } catch (error) {
    console.error("Error formatting date:", error);
    return String(date);
  }
}

/**
 * Format time to a simple hours-minutes format: e.g. "15:30"
 */
export function formatTime(date: Date | string): string {
  if (!date) return "";

  const d = typeof date === "string" ? new Date(date) : date;

  try {
    return d.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (error) {
    console.error("Error formatting time:", error);
    return String(date);
  }
}

// Emoji categories for use in dialogs
export const emojiCategories = {
  general: [
    "👥",
    "👤",
    "😊",
    "😎",
    "🌟",
    "🔥",
    "💪",
    "😀",
    "😃",
    "😄",
    "😁",
    "😆",
    "😅",
    "😂",
    "🤣",
    "🙂",
    "🙃",
    "😉",
    "😌",
    "😍",
    "🥰",
    "😘",
    "😗",
    "😙",
    "😚",
    "😋",
    "😛",
    "😝",
    "😜",
    "🤪",
    "🤨",
    "🧐",
    "🤓",
    "🤩",
    "🥳",
    "😏",
    "😒",
    "😞",
    "😔",
    "😟",
    "😕",
    "🙁",
    "☹️",
    "😣",
    "😖",
    "😫",
    "😩",
    "🥺",
    "😢",
    "😭",
    "😤",
    "😠",
    "😡",
    "🤬",
    "🤯",
    "😳",
    "🥵",
    "🥶",
    "😱",
    "😨",
    "😰",
    "😥",
    "✨",
    "⭐",
    "🌈",
    "☀️",
    "⚡",
    "❤️",
    "🧡",
    "💛",
    "💚",
    "💙",
    "💜",
    "🖤",
    "❣️",
    "💕",
    "💞",
    "💓",
    "💗",
    "💖",
    "💘",
    "💝",
    "💯",
    "👑",
    "🎖️",
    "🏅",
    "🏵️",
    "🔰",
    "🎗️",
    "🤝",
    "👏",
    "👊",
    "✊",
    "🤟",
  ],
  animals: [
    "🦁",
    "🐯",
    "🦊",
    "🐼",
    "🐨",
    "🐻",
    "🦄",
    "🦓",
    "🐘",
    "🦏",
    "🐪",
    "🦬",
    "🐃",
    "🐂",
    "🦌",
    "🐕",
    "🐈",
    "🦮",
    "🐄",
    "🐏",
    "🐑",
    "🦙",
    "🐐",
    "🦘",
    "🐰",
    "🐇",
    "🦝",
    "🦨",
    "🦡",
    "🦔",
    "🐿️",
    "🦫",
    "🐉",
    "🦭",
    "🐳",
    "🐋",
    "🐬",
    "🦈",
    "🐟",
    "🦅",
    "🦆",
    "🦉",
    "🦇",
    "🐌",
    "🦋",
    "🐝",
    "🐢",
    "🦎",
    "🐍",
    "🐙",
    "🦑",
    "🐺",
  ],
  sports: [
    // Ball sports
    "⚽️",
    "🏀",
    "⚾",
    "🏈",
    "🏐",
    "🏉",
    "🥎",
    "🏏",
    "🎱",
    // Racquet sports
    "🏓",
    "🏸",
    "🎾",
    // Water sports
    "🏄",
    "🏊",
    "🚣",
    "🛶",
    "🤽",
    // Winter sports
    "⛸️",
    "🏂",
    "🎿",
    "🥌",
    "🛷",
    // Combat sports
    "🥋",
    "🥊",
    "🤺",
    "🤼",
    // Outdoor sports
    "🚴",
    "🏇",
    "🧗",
    "🏹",
    "🚵",
    "🛹",
    "⛳",
    "🥏",
    // Team sports
    "🏑",
    "🏒",
    "🥍",
    "⛹️",
    // Individual sports
    "🏋️",
    "🎯",
    "🎳",
    "🤸",
    // Trophies and awards
    "🏆",
    "🥅",
  ],
  games: ["🎲", "🎮", "🧩", "🪀", "🪁"],
  arts: ["🎸", "🎤", "🎧", "🚀", "🎭", "🎨", "🎬", "🎼", "💡", "💥"],
  tech: ["📚", "📝", "✏️", "🖋️", "💻", "📱", "🕹️"],
};

// All emojis flattened for the "All" view
export const allEmojis = Object.values(emojiCategories).flat();

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
