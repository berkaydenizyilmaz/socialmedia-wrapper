import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Fix Instagram's broken Turkish character encoding
 * Instagram exports use Latin-1 bytes interpreted as UTF-8, causing mojibake
 * @param {string} str - String with potentially broken encoding
 * @returns {string} Fixed string
 */
export function fixTurkishChars(str) {
  if (!str) return str;
  try {
    // Try to fix common mojibake patterns for Turkish chars
    const fixes = {
      'Ã¼': 'ü', 'Ã¶': 'ö', 'Ã§': 'ç', 'ÅŸ': 'ş', 'Ä±': 'ı', 'ÄŸ': 'ğ',
      'Ãœ': 'Ü', 'Ã–': 'Ö', 'Ã‡': 'Ç', 'Åž': 'Ş', 'Ä°': 'İ', 'Äž': 'Ğ',
      'Å\u009f': 'ş', 'Ä\u00b1': 'ı', 'Ä\u009f': 'ğ',
      'ş': 'ş', 'ı': 'ı', 'ğ': 'ğ', 'ü': 'ü', 'ö': 'ö', 'ç': 'ç'
    };
    
    let fixed = str;
    for (const [broken, correct] of Object.entries(fixes)) {
      fixed = fixed.split(broken).join(correct);
    }
    
    // Also try decoding as Latin-1 -> UTF-8
    try {
      const decoded = decodeURIComponent(escape(fixed));
      if (decoded !== fixed) return decoded;
    } catch {
      // ignore decode errors
    }
    
    return fixed;
  } catch {
    return str;
  }
}
