import { ussdMenus } from "../config/ussdMenus.js";
import { sessionManager } from "../utils/sessionManager.js";

// Language handlers - set language and redirect to main menu
export const languageHandlers = {
  en: (userData) => {
    sessionManager.setLanguage(userData.sessionId, "en");
    return ussdMenus.main.text;
  },
  rw: (userData) => {
    sessionManager.setLanguage(userData.sessionId, "rw");
    return ussdMenus.main.text;
  },
  fr: (userData) => {
    sessionManager.setLanguage(userData.sessionId, "fr");
    return ussdMenus.main.text;
  },
  sw: (userData) => {
    sessionManager.setLanguage(userData.sessionId, "sw");
    return ussdMenus.main.text;
  },
};

// Terminal handlers - actions that end the USSD session
export const terminalHandlers = {
  submitEmergency: (userData) => {
    // TODO: Save emergency to database
    // TODO: Trigger notification to rescue team
    // TODO: Send SMS confirmation to user
    return `END Thank you! Your emergency has been reported. The rescue team will be on the way shortly. Stay safe!`;
  },

  confirmDistress: (userData) => {
    // TODO: Trigger immediate distress alert
    // TODO: Get user location and send to emergency services
    // TODO: Notify emergency contacts
    return `END DISTRESS ALERT ACTIVATED! Emergency services have been notified of your location. Help is on the way. Stay calm and safe.`;
  },
};

// Main USSD navigation handler
export const handleUSSDRequest = (text, userData) => {
  const levels = text.split("*");

  // Initial request - show welcome screen
  if (text === "") {
    return ussdMenus.welcome.text;
  }

  // Check if user has a session
  let session = sessionManager.getSession(userData.sessionId);

  // Navigate through menu levels
  let currentMenu = "welcome";

  for (let i = 0; i < levels.length; i++) {
    const choice = levels[i];
    const menu = ussdMenus[currentMenu];

    if (!menu || !menu.options[choice]) {
      return "END Invalid option selected";
    }

    const nextStep = menu.options[choice];

    // Check if it's a language handler (from welcome or settings)
    if (languageHandlers[nextStep]) {
      const response = languageHandlers[nextStep](userData);
      // If this is the last level, return the main menu
      if (i === levels.length - 1) {
        return response;
      }
      // Otherwise, continue navigation from main menu
      currentMenu = "main";
      continue;
    }

    // Check if it's a terminal handler
    if (terminalHandlers[nextStep]) {
      return terminalHandlers[nextStep](userData);
    }

    // Check if it's another menu
    if (ussdMenus[nextStep]) {
      currentMenu = nextStep;

      // If this is the last level, show the menu
      if (i === levels.length - 1) {
        return ussdMenus[nextStep].text;
      }
    }
  }

  return "END Invalid navigation";
};

// USSD Controller - main entry point
export const ussdHandler = (req, res) => {
  const { sessionId, serviceCode, phoneNumber, text } = req.body;

  const userData = {
    sessionId,
    serviceCode,
    phoneNumber,
  };

  const response = handleUSSDRequest(text, userData);

  // Send the response back to the API
  res.set("Content-Type", "text/plain");
  res.send(response);
};
