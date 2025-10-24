import { t } from "./i18n.js";

/**
 * Generate USSD menu text with translations
 * @param {string} locale - Current locale
 * @returns {Object} USSD menus with translated text
 */
export const getUssdMenus = (locale = "en") => {
  return {
    welcome: {
      text: `CON ${t("welcome.title", {}, locale)}
    ${t("welcome.select_language", {}, locale)}
    1. ${t("welcome.english", {}, locale)}
    2. ${t("welcome.kinyarwanda", {}, locale)}
    3. ${t("welcome.french", {}, locale)}
    4. ${t("welcome.swahili", {}, locale)}
    `,
      options: {
        1: "en",
        2: "rw",
        3: "fr",
        4: "sw",
      },
    },

    main: {
      text: `CON ${t("main.title", {}, locale)}
    1. ${t("main.emergencies", {}, locale)}
    2. ${t("main.community_posts", {}, locale)}
    3. ${t("main.hotlines", {}, locale)}
    4. ${t("main.distress", {}, locale)}
    5. ${t("main.ai_assistance", {}, locale)}
    6. ${t("main.settings", {}, locale)}
    `,
      options: {
        1: "emergencies",
        2: "communityPosts",
        3: "hotlines",
        4: "distress",
        5: "aiAssistance",
        6: "settings",
      },
    },

    emergencies: {
      text: `CON ${t("emergencies.title", {}, locale)}
    1. ${t("emergencies.view_emergencies", {}, locale)}
    2. ${t("emergencies.report_emergency", {}, locale)}
    3. ${t("emergencies.my_emergencies", {}, locale)}
    0. ${t("emergencies.go_back", {}, locale)}
    `,
      options: {
        1: "viewEmergencies",
        2: "reportEmergency",
        3: "myEmergencies",
        0: "main",
      },
    },

    communityPosts: {
      text: `CON ${t("community_posts.title", {}, locale)}
    1. ${t("community_posts.news", {}, locale)}
    2. ${t("community_posts.events", {}, locale)}
    0. ${t("community_posts.go_back", {}, locale)}
    `,
      options: {
        1: "news",
        2: "events",
        0: "main",
      },
    },

    hotlines: {
      text: `CON ${t("hotlines.title", {}, locale)}
    1. ${t("hotlines.police", {}, locale)}
    2. ${t("hotlines.fire", {}, locale)}
    3. ${t("hotlines.ambulance", {}, locale)}
    0. ${t("hotlines.go_back", {}, locale)}
    `,
      options: {
        1: "main",
        2: "main",
        3: "main",
        0: "main",
      },
    },

    distress: {
      text: `CON ${t("distress.message", {}, locale)}
    1. ${t("distress.confirm", {}, locale)}
    0. ${t("distress.cancel", {}, locale)}
    `,
      options: {
        1: "confirmDistress",
        0: "main",
      },
    },

    settings: {
      text: `CON ${t("settings.title", {}, locale)}
    1. ${t("settings.change_language", {}, locale)}
    2. ${t("settings.terms_of_service", {}, locale)}
    3. ${t("settings.privacy_policy", {}, locale)}
    0. ${t("settings.go_back", {}, locale)}
    `,
      options: {
        1: "languages",
        2: "terms",
        3: "privacy",
        0: "main",
      },
    },

    //  sub screens
    reportEmergency: {
      text: `CON ${t("report_emergency.title", {}, locale)}
    1. ${t("report_emergency.fire", {}, locale)}
    2. ${t("report_emergency.medical", {}, locale)}
    3. ${t("report_emergency.accident", {}, locale)}
    4. ${t("report_emergency.crime", {}, locale)}
    5. ${t("report_emergency.other", {}, locale)}
    0. ${t("report_emergency.go_back", {}, locale)}
    `,
      options: {
        1: "additionalInfo",
        2: "additionalInfo",
        3: "additionalInfo",
        4: "additionalInfo",
        5: "additionalInfo",
        0: "emergencies",
      },
    },

    additionalInfo: {
      text: `CON ${t("report_emergency.additional_info_prompt", {}, locale)}
    1. ${t("common.continue", {}, locale)}
    0. ${t("common.go_back", {}, locale)}
    `,
      options: {
        1: "confirmEmergency",
        0: "reportEmergency",
      },
      acceptsInput: true, // Flag to indicate this menu accepts free text
    },

    confirmEmergency: {
      text: `CON Are you sure you want to report this emergency?
    1. ${t("common.confirm", {}, locale)}
    0. ${t("common.cancel", {}, locale)}
    `,
      options: {
        1: "submitEmergency",
        0: "emergencies",
      },
    },

    languages: {
      text: `CON ${t("languages.title", {}, locale)}
    1. ${t("languages.english", {}, locale)}
    2. ${t("languages.kinyarwanda", {}, locale)}
    3. ${t("languages.french", {}, locale)}
    4. ${t("languages.swahili", {}, locale)}
    0. ${t("languages.go_back", {}, locale)}
    `,
      options: {
        1: "en",
        2: "rw",
        3: "fr",
        4: "sw",
        0: "main",
      },
    },

    terms: {
      text: `CON ${t("settings.terms_of_service", {}, locale)}
    0. ${t("common.go_back", {}, locale)}
    `,
      options: {
        0: "main",
      },
    },

    privacy: {
      text: `CON ${t("settings.privacy_policy", {}, locale)}
    0. ${t("common.go_back", {}, locale)}
    `,
      options: {
        0: "main",
      },
    },

    aiAssistance: {
      text: `CON ${t("ai_assistance.title", {}, locale)}
    ${t("ai_assistance.select_emergency", {}, locale)}
    1. ${t("ai_assistance.fire", {}, locale)}
    2. ${t("ai_assistance.medical", {}, locale)}
    3. ${t("ai_assistance.accident", {}, locale)}
    4. ${t("ai_assistance.crime", {}, locale)}
    5. ${t("ai_assistance.custom", {}, locale)}
    0. ${t("ai_assistance.go_back", {}, locale)}
    `,
      options: {
        1: "getAIGuidance",
        2: "getAIGuidance",
        3: "getAIGuidance",
        4: "getAIGuidance",
        5: "customAIRequest",
        0: "main",
      },
    },

    customAIRequest: {
      text: `CON ${t("ai_assistance.custom_prompt", {}, locale)}
    1. ${t("common.go_back", {}, locale)}
    `,
      options: {
        1: "aiAssistance",
      },
      acceptsInput: true,
    },
  };
};

// Default export for backward compatibility
export const ussdMenus = getUssdMenus("en");
