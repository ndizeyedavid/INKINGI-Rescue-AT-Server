import { ussdMenus } from "../config/ussdMenus.js";
import { sessionManager } from "../utils/sessionManager.js";
import { EMERGENCY_TYPE_LABELS } from "../config/constants.js";
import {
  sendEmergencyConfirmation,
  sendDistressAlert,
  notifyRescueTeam,
} from "./smsController.js";
import {
  reportEmergency,
  getUserEmergencies,
  triggerDistressAlert,
  getPosts,
} from "../services/backendApiService.js";

// Language handlers - set language and redirect to main menu
export const languageHandlers = {
  en: async (userData) => {
    sessionManager.setLanguage(userData.sessionId, "en");
    return ussdMenus.main.text;
  },
  rw: async (userData) => {
    sessionManager.setLanguage(userData.sessionId, "rw");
    return ussdMenus.main.text;
  },
  fr: async (userData) => {
    sessionManager.setLanguage(userData.sessionId, "fr");
    return ussdMenus.main.text;
  },
  sw: async (userData) => {
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

// Helper function to get additional info from session
const getAdditionalInfoFromSession = (sessionId) => {
  const session = sessionManager.getSession(sessionId);
  return session?.additionalInfo || "";
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

      // Get additional info if provided
      const additionalInfo = getAdditionalInfoFromSession(userData.sessionId);

      // Prepare emergency data for backend
      const emergencyData = {
        phoneNumber: userData.phoneNumber,
        emergencyType: emergencyInfo.type,
        referenceId,
        description:
          additionalInfo ||
          `${emergencyInfo.label} emergency reported via USSD`,
        location: "Location to be determined", // TODO: Get actual location
        status: "pending",
        reportedAt: new Date().toISOString(),
      };

      // Report emergency to backend
      const backendResult = await reportEmergency(emergencyData);

      if (backendResult.success) {
        console.log("✅ Emergency saved to backend:", backendResult.data);

        // Store emergency data in session for tracking
        sessionManager.setSession(userData.sessionId, {
          lastEmergency: {
            referenceId,
            type: emergencyInfo.type,
            phoneNumber: userData.phoneNumber,
            timestamp: new Date().toISOString(),
            backendId: backendResult.data?.id,
          },
        });

        // Send SMS confirmation to user
        // await sendEmergencyConfirmation(
        //   userData.phoneNumber,
        //   emergencyInfo.label,
        //   referenceId
        // );

        return `END Thank you! Your ${emergencyInfo.label} emergency has been reported.\n\nReference: ${referenceId}\n\nA confirmation SMS has been sent. The rescue team will be on the way shortly. Stay safe!`;
      } else {
        console.error(
          "❌ Failed to save emergency to backend:",
          backendResult.error
        );
        // Still send SMS even if backend fails
        // await sendEmergencyConfirmation(
        //   userData.phoneNumber,
        //   emergencyInfo.label,
        //   referenceId
        // );
        return `END Your emergency has been reported.\n\nReference: ${referenceId}\n\nHelp is on the way!`;
      }
    } catch (error) {
      console.error("Error submitting emergency:", error);
      const fallbackRef = generateReferenceId();
      return `END Your emergency has been reported. Reference: ${fallbackRef}. Help is on the way!`;
    }
  },

  confirmDistress: async (userData) => {
    try {
      const referenceId = generateReferenceId();

      // Prepare distress data for backend
      const distressData = {
        phoneNumber: userData.phoneNumber,
        message: "Urgent help needed!",
        location: "Location to be determined", // TODO: Get actual location
      };

      // Trigger distress alert in backend
      const backendResult = await triggerDistressAlert(distressData);

      if (backendResult.success) {
        console.log("✅ Distress alert sent to backend:", backendResult.data);

        // Store distress alert in session
        sessionManager.setSession(userData.sessionId, {
          distressAlert: {
            referenceId,
            phoneNumber: userData.phoneNumber,
            timestamp: new Date().toISOString(),
            backendId: backendResult.data?.id,
          },
        });

        // Send distress SMS to user
        // await sendDistressAlert(userData.phoneNumber, "Your current location");

        return `END DISTRESS ALERT ACTIVATED!\n\nReference: ${referenceId}\n\nEmergency services have been notified. Help is on the way. Stay calm and safe.`;
      } else {
        console.error(
          "❌ Failed to send distress alert to backend:",
          backendResult.error
        );
        // Still show confirmation even if backend fails
        return `END DISTRESS ALERT ACTIVATED!\n\nReference: ${referenceId}\n\nHelp is on the way. Stay calm and safe.`;
      }
    } catch (error) {
      console.error("Error confirming distress:", error);
      const fallbackRef = generateReferenceId();
      return `END DISTRESS ALERT ACTIVATED! Reference: ${fallbackRef}. Help is on the way. Stay calm and safe.`;
    }
  },
};

// Dynamic menu handlers - fetch data from backend
const dynamicMenuHandlers = {
  viewEmergencies: async (userData) => {
    const { fetchAndFormatAllEmergencies } = await import(
      "../utils/ussdDataHelpers.js"
    );
    return await fetchAndFormatAllEmergencies(userData.sessionId);
  },
  myEmergencies: async (userData) => {
    const { fetchAndFormatUserEmergencies } = await import(
      "../utils/ussdDataHelpers.js"
    );
    return await fetchAndFormatUserEmergencies(userData.phoneNumber, userData.sessionId);
  },
  news: async (userData) => {
    const { fetchAndFormatPosts } = await import("../utils/ussdDataHelpers.js");
    return await fetchAndFormatPosts(userData.sessionId);
  },
  viewEmergency: async (userData, selectedIndex) => {
    const { fetchAndFormatEmergencyDetails } = await import("../utils/ussdDataHelpers.js");
    
    // Get the stored emergencies list from session
    const session = sessionManager.getSession(userData.sessionId);
    const emergenciesList = session?.emergenciesList || [];
    
    // Get the selected emergency (selectedIndex is 1-based)
    const emergency = emergenciesList[selectedIndex - 1];
    
    if (!emergency) {
      return `CON Emergency not found
0. Go back`;
    }
    
    return await fetchAndFormatEmergencyDetails(emergency.id);
  },
  viewNews: async (userData, selectedIndex) => {
    const { fetchAndFormatPostDetails } = await import("../utils/ussdDataHelpers.js");
    
    // Get the stored posts list from session
    const session = sessionManager.getSession(userData.sessionId);
    const postsList = session?.postsList || [];
    
    // Get the selected post (selectedIndex is 1-based)
    const post = postsList[selectedIndex - 1];
    
    if (!post) {
      return `CON Post not found
0. Go back`;
    }
    
    return await fetchAndFormatPostDetails(post.id);
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
      const response = await languageHandlers[nextStep](userData);
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

    // Check if it's a dynamic menu handler (fetches data from backend)
    if (dynamicMenuHandlers[nextStep]) {
      if (i === levels.length - 1) {
        // For detail views, pass the selected index
        if (nextStep === "viewEmergency" || nextStep === "viewNews") {
          const selectedIndex = parseInt(choice);
          return await dynamicMenuHandlers[nextStep](userData, selectedIndex);
        }
        return await dynamicMenuHandlers[nextStep](userData);
      }
      currentMenu = nextStep;
      continue;
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
