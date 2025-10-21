// Application constants
export const APP_CONFIG = {
  NAME: "INKINGI Rescue",
  VERSION: "1.0.0",
  DEFAULT_LANGUAGE: "en",
};

// Emergency types
export const EMERGENCY_TYPES = {
  FIRE: "fire",
  MEDICAL: "medical",
  ASSAULT: "assault",
  CORRUPTION: "corruption",
  ACCIDENT: "accident",
  OTHER: "other",
};

// Emergency type labels
export const EMERGENCY_TYPE_LABELS = {
  1: { type: "fire", label: "Fire" },
  2: { type: "medical", label: "Medical" },
  3: { type: "assault", label: "Assault" },
  4: { type: "corruption", label: "Corruption" },
  5: { type: "accident", label: "Accident" },
  6: { type: "other", label: "Other" },
};

// Hotline numbers
export const HOTLINES = {
  POLICE: "112",
  FIRE: "113",
  AMBULANCE: "114",
};

// Supported languages
export const LANGUAGES = {
  ENGLISH: "en",
  KINYARWANDA: "rw",
  FRENCH: "fr",
  KISWAHILI: "sw",
};

// SMS Configuration
export const SMS_CONFIG = {
  SENDER_ID: "INKINGI", // Your approved sender ID
  MAX_LENGTH: 160, // Standard SMS length
  ENABLE_DELIVERY_REPORTS: true,
};

// Session timeout (in milliseconds)
export const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
