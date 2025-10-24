import { I18n } from "i18n-js";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load translation files
const en = JSON.parse(
  readFileSync(join(__dirname, "../locales/en.json"), "utf-8")
);
const rw = JSON.parse(
  readFileSync(join(__dirname, "../locales/rw.json"), "utf-8")
);
const fr = JSON.parse(
  readFileSync(join(__dirname, "../locales/fr.json"), "utf-8")
);
const sw = JSON.parse(
  readFileSync(join(__dirname, "../locales/sw.json"), "utf-8")
);

// Initialize i18n
const i18n = new I18n({
  en,
  rw,
  fr,
  sw,
});

// Set default locale
i18n.defaultLocale = "en";
i18n.locale = "en";

// Enable fallback to default locale
i18n.enableFallback = true;

/**
 * Get translation for a key
 * @param {string} key - Translation key
 * @param {Object} options - Interpolation options
 * @param {string} locale - Locale to use (optional)
 * @returns {string} Translated text
 */
export const t = (key, options = {}, locale = null) => {
  if (locale) {
    return i18n.t(key, { ...options, locale });
  }
  return i18n.t(key, options);
};

/**
 * Set the current locale
 * @param {string} locale - Locale code (en, rw, fr, sw)
 */
export const setLocale = (locale) => {
  if (["en", "rw", "fr", "sw"].includes(locale)) {
    i18n.locale = locale;
  }
};

/**
 * Get the current locale
 * @returns {string} Current locale code
 */
export const getLocale = () => {
  return i18n.locale;
};

/**
 * Get translation for a specific locale
 * @param {string} key - Translation key
 * @param {string} locale - Locale code
 * @param {Object} options - Interpolation options
 * @returns {string} Translated text
 */
export const tl = (key, locale, options = {}) => {
  return i18n.t(key, { ...options, locale });
};

export default i18n;
