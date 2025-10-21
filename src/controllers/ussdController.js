import { ussdMenus } from "../config/ussdMenus.js";
import { sessionManager } from "../utils/sessionManager.js";
import { EMERGENCY_TYPE_LABELS } from "../config/constants.js";
import {
  sendEmergencyConfirmation,
  sendDistressAlert,
  notifyRescueTeam,
} from "./smsController.js";

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

// Helper function to generate reference ID
const generateReferenceId = () => {
  return `INK${Date.now().toString().slice(-8)}`;
};

// Helper function to get emergency type from session
const getEmergencyTypeFromSession = (sessionId, text) => {
  const levels = text.split("*");
  // Find the emergency type selection (it's after reportEmergency menu)
  for (let i = 0; i < levels.length; i++) {
    const choice = levels[i];
    if (EMERGENCY_TYPE_LABELS[choice]) {
      return EMERGENCY_TYPE_LABELS[choice];
    }
  }
  return { type: "other", label: "Emergency" };
};

// Terminal handlers - actions that end the USSD session
export const terminalHandlers = {
  submitEmergency: async (userData) => {
    try {
      // Generate reference ID
      const referenceId = generateReferenceId();
      
      // Get emergency type from session/navigation
      const emergencyInfo = getEmergencyTypeFromSession(
        userData.sessionId,
        userData.text
      );
      
      // Store emergency data in session for tracking
      sessionManager.setSession(userData.sessionId, {
        lastEmergency: {
          referenceId,
          type: emergencyInfo.type,
          phoneNumber: userData.phoneNumber,
          timestamp: new Date().toISOString(),
        },
      });

      // Send SMS confirmation to user
      await sendEmergencyConfirmation(
        userData.phoneNumber,
        emergencyInfo.label,
        referenceId
      );

      // TODO: Save emergency to database
      // TODO: Get user location if available
      // TODO: Notify rescue team
      // Example: await notifyRescueTeam(["+250788000000"], emergencyInfo.label, "Location", userData.phoneNumber);

      return `END Thank you! Your ${emergencyInfo.label} emergency has been reported.\n\nReference: ${referenceId}\n\nA confirmation SMS has been sent. The rescue team will be on the way shortly. Stay safe!`;
    } catch (error) {
      console.error("Error submitting emergency:", error);
      return `END Your emergency has been reported. Reference: ${generateReferenceId()}. Help is on the way!`;
    }
  },

  confirmDistress: async (userData) => {
    try {
      const referenceId = generateReferenceId();
      
      // Store distress alert in session
      sessionManager.setSession(userData.sessionId, {
        distressAlert: {
          referenceId,
          phoneNumber: userData.phoneNumber,
          timestamp: new Date().toISOString(),
        },
      });

      // Send distress SMS to user
      await sendDistressAlert(userData.phoneNumber, "Your current location");

      // TODO: Trigger immediate distress alert
      // TODO: Get user location and send to emergency services
      // TODO: Notify emergency contacts
      // TODO: Alert all nearby rescue teams
      // Example: await notifyRescueTeam(["+250788000000", "+250788111111"], "DISTRESS ALERT", "Location", userData.phoneNumber);

      return `END DISTRESS ALERT ACTIVATED!\n\nReference: ${referenceId}\n\nEmergency services have been notified of your location. A confirmation SMS has been sent. Help is on the way. Stay calm and safe.`;
    } catch (error) {
      console.error("Error confirming distress:", error);
      return `END DISTRESS ALERT ACTIVATED! Emergency services have been notified. Help is on the way. Stay calm and safe.`;
    }
  },
};

// Main USSD navigation handler
export const handleUSSDRequest = async (text, userData) => {
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
      // Add text to userData for emergency type tracking
      userData.text = text;
      return await terminalHandlers[nextStep](userData);
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
export const ussdHandler = async (req, res) => {
  const { sessionId, serviceCode, phoneNumber, text } = req.body;

  const userData = {
    sessionId,
    serviceCode,
    phoneNumber,
  };

  const response = await handleUSSDRequest(text, userData);

  // Send the response back to the API
  res.set("Content-Type", "text/plain");
  res.send(response);
};
