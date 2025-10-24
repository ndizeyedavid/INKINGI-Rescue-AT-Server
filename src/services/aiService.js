import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load AI system instructions
const systemInstructions = readFileSync(
  join(__dirname, "../config/ai-instructions.txt"),
  "utf-8"
);

// Initialize Gemini AI
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

/**
 * Get AI assistance for emergency situations
 * @param {string} emergencyType - Type of emergency (fire, medical, accident, etc.)
 * @param {string} customRequest - Optional custom request from user
 * @param {string} locale - User's language preference
 * @returns {Promise<Object>} AI response with guidance
 */
export const getEmergencyGuidance = async (
  emergencyType,
  customRequest = null,
  locale = "en"
) => {
  try {
    const config = {
      systemInstruction: [
        {
          text: systemInstructions,
        },
      ],
    };

    const model = "gemini-flash-lite-latest";

    // Build the user prompt based on emergency type and language
    let userPrompt = "";

    if (customRequest) {
      // User has a specific question
      userPrompt = buildCustomPrompt(customRequest, locale);
    } else {
      // Standard emergency guidance
      userPrompt = buildEmergencyPrompt(emergencyType, locale);
    }

    const contents = [
      {
        role: "user",
        parts: [
          {
            text: userPrompt,
          },
        ],
      },
    ];

    const response = await ai.models.generateContentStream({
      model,
      config,
      contents,
    });

    // Collect the streamed response
    let fullText = "";
    for await (const chunk of response) {
      fullText += chunk.text;
    }

    // Format for USSD (max 600 characters)
    const formattedText = formatForUSSD(fullText);

    return {
      success: true,
      guidance: formattedText,
    };
  } catch (error) {
    console.error("Error getting AI guidance:", error);
    return {
      success: false,
      error: error.message,
      guidance: getDefaultGuidance(emergencyType, locale),
    };
  }
};

/**
 * Build prompt for standard emergency guidance
 */
const buildEmergencyPrompt = (emergencyType, locale) => {
  const languageInstruction = getLanguageInstruction(locale);

  const prompts = {
    fire: `${languageInstruction} A person is experiencing a FIRE emergency right now. Provide immediate, life-saving guidance (max 300 characters). Follow the FIRE EMERGENCIES section in your instructions.`,
    medical: `${languageInstruction} A person is experiencing a MEDICAL emergency right now. Provide immediate, life-saving first aid guidance (max 300 characters). Follow the MEDICAL EMERGENCIES section in your instructions.`,
    accident: `${languageInstruction} A person is at an ACCIDENT scene right now. Provide immediate guidance (max 300 characters). Follow the ACCIDENTS section in your instructions.`,
    crime: `${languageInstruction} A person is experiencing a CRIME/SAFETY emergency right now. Provide immediate safety guidance (max 300 characters). Follow the CRIME/SAFETY section in your instructions.`,
    other: `${languageInstruction} A person is experiencing an emergency right now. Provide general emergency guidance (max 300 characters). Follow your core responsibilities.`,
  };

  return prompts[emergencyType] || prompts.other;
};

/**
 * Build prompt for custom user request
 */
const buildCustomPrompt = (customRequest, locale) => {
  const languageInstruction = getLanguageInstruction(locale);
  return `${languageInstruction} A person in Rwanda needs emergency assistance. Their question: "${customRequest}". Provide brief (max 300 characters), actionable, life-saving guidance. Follow your core responsibilities and emergency-specific guidance as applicable.`;
};

/**
 * Get language instruction for AI
 */
const getLanguageInstruction = (locale) => {
  const instructions = {
    en: "Respond in English.",
    rw: "Respond in Kinyarwanda (Rwanda's native language).",
    fr: "Respond in French.",
    sw: "Respond in Swahili.",
  };
  return instructions[locale] || instructions.en;
};

/**
 * Format AI response for USSD display
 */
const formatForUSSD = (text) => {
  // Remove markdown formatting
  let formatted = text.replace(/[*_#]/g, "");

  // Remove extra whitespace
  formatted = formatted.replace(/\s+/g, " ").trim();

  // Limit to reasonable USSD length (around 600 characters for multiple screens)
  if (formatted.length > 600) {
    formatted = formatted.substring(0, 597) + "...";
  }

  return formatted;
};

/**
 * Get default guidance if AI fails
 */
const getDefaultGuidance = (emergencyType, locale) => {
  const defaultGuidance = {
    en: {
      fire: "FIRE: Get out immediately. Stay low. Don't use elevators. Call 111. Don't go back inside.",
      medical:
        "MEDICAL: Call 912. Keep person calm. Don't move if injured. Apply pressure to bleeding. Monitor breathing.",
      accident:
        "ACCIDENT: Call 112. Don't move injured. Secure scene. Check breathing. Apply pressure to bleeding.",
      crime:
        "CRIME: Get to safety first. Call 112. Remember details. Don't confront. Find witnesses.",
      other:
        "EMERGENCY: Stay calm. Call appropriate emergency number. Follow operator instructions. Stay safe.",
    },
    rw: {
      fire: "UMURIRO: Sohoka ako kanya. Kora hasi. Ntukoreshe lift. Hamagara 111. Ntugaruke imbere.",
      medical:
        "UBUVUZI: Hamagara 912. Humuriza umuntu. Ntumukingure niba yakomeretse. Kanda aho ahumanya amaraso.",
      accident:
        "IMPANUKA: Hamagara 112. Ntukingure abakomeretse. Tegura ahantu. Reba uburyo bahumeka.",
      crime:
        "ICYAHA: Irinda ubuzima bwawe. Hamagara 112. Wibuke ibisobanuro. Ntukongere.",
      other:
        "IKIBABAJE: Komera. Hamagara nimero ikwiye. Kurikiza inama. Witondere.",
    },
    fr: {
      fire: "FEU: Sortez immédiatement. Restez bas. N'utilisez pas l'ascenseur. Appelez 111.",
      medical:
        "MÉDICAL: Appelez 912. Gardez la personne calme. Ne bougez pas si blessé. Appliquez pression sur saignement.",
      accident:
        "ACCIDENT: Appelez 112. Ne déplacez pas blessés. Sécurisez zone. Vérifiez respiration.",
      crime:
        "CRIME: Mettez-vous en sécurité. Appelez 112. Mémorisez détails. Ne confrontez pas.",
      other:
        "URGENCE: Restez calme. Appelez numéro approprié. Suivez instructions. Restez en sécurité.",
    },
    sw: {
      fire: "MOTO: Toka haraka. Kaa chini. Usitumie lifti. Piga 111. Usirudi ndani.",
      medical:
        "MATIBABU: Piga 912. Tuliza mtu. Usisogeze ikiwa amejeruhiwa. Bana mahali pa damu.",
      accident:
        "AJALI: Piga 112. Usisogeze waliojeruhiwa. Linda eneo. Angalia kupumua.",
      crime: "UHALIFU: Jilinde kwanza. Piga 112. Kumbuka maelezo. Usipingane.",
      other:
        "DHARURA: Tulia. Piga nambari sahihi. Fuata maelekezo. Kaa salama.",
    },
  };

  const localeGuidance = defaultGuidance[locale] || defaultGuidance.en;
  return localeGuidance[emergencyType] || localeGuidance.other;
};
