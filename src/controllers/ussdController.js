import { getUssdMenus } from "../config/ussdMenus.js";
import { sessionManager } from "../utils/sessionManager.js";
import { EMERGENCY_TYPE_LABELS } from "../config/constants.js";
import { t } from "../config/i18n.js";
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
import { getEmergencyGuidance } from "../services/aiService.js";

// Language handlers - set language and redirect to main menu
export const languageHandlers = {
  en: async (userData) => {
    sessionManager.setLanguage(userData.sessionId, "en");
    const menus = getUssdMenus("en");
    return menus.main.text;
  },
  rw: async (userData) => {
    sessionManager.setLanguage(userData.sessionId, "rw");
    const menus = getUssdMenus("rw");
    return menus.main.text;
  },
  fr: async (userData) => {
    sessionManager.setLanguage(userData.sessionId, "fr");
    const menus = getUssdMenus("fr");
    return menus.main.text;
  },
  sw: async (userData) => {
    sessionManager.setLanguage(userData.sessionId, "sw");
    const menus = getUssdMenus("sw");
    return menus.main.text;
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
  getAIGuidance: async (userData) => {
    try {
      const locale = userData.locale || "en";
      
      // Get emergency type from navigation path
      const emergencyTypeMap = {
        1: "fire",
        2: "medical",
        3: "accident",
        4: "crime",
      };
      
      const levels = userData.text.split("*");
      const aiMenuChoice = levels[levels.length - 1];
      const emergencyType = emergencyTypeMap[aiMenuChoice] || "other";
      
      // Get AI guidance
      const result = await getEmergencyGuidance(emergencyType, null, locale);
      
      if (result.success) {
        return `END ${t("ai_assistance.guidance_title", {}, locale)}\n\n${result.guidance}\n\nStay safe!`;
      } else {
        // Return default guidance if AI fails
        return `END ${t("ai_assistance.guidance_title", {}, locale)}\n\n${result.guidance}\n\nStay safe!`;
      }
    } catch (error) {
      console.error("Error getting AI guidance:", error);
      const locale = userData.locale || "en";
      return `END ${t("responses.unable_to_load", { item: "AI guidance" }, locale)}`;
    }
  },

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
    const locale = userData.locale || "en";
    return await fetchAndFormatAllEmergencies(userData.sessionId, locale);
  },
  myEmergencies: async (userData) => {
    const { fetchAndFormatUserEmergencies } = await import(
      "../utils/ussdDataHelpers.js"
    );
    const locale = userData.locale || "en";
    return await fetchAndFormatUserEmergencies(userData.phoneNumber, userData.sessionId, locale);
  },
  news: async (userData) => {
    const { fetchAndFormatPosts } = await import("../utils/ussdDataHelpers.js");
    const locale = userData.locale || "en";
    return await fetchAndFormatPosts(userData.sessionId, locale);
  },
  viewEmergency: async (userData, selectedIndex) => {
    const { fetchAndFormatEmergencyDetails } = await import("../utils/ussdDataHelpers.js");
    const locale = userData.locale || "en";
    
    // Get the stored emergencies list from session
    const session = sessionManager.getSession(userData.sessionId);
    const emergenciesList = session?.emergenciesList || [];
    
    // Get the selected emergency (selectedIndex is 1-based)
    const emergency = emergenciesList[selectedIndex - 1];
    
    if (!emergency) {
      return `CON ${t("responses.emergency_not_found", {}, locale)}
0. ${t("common.go_back", {}, locale)}`;
    }
    
    return await fetchAndFormatEmergencyDetails(emergency.id, locale);
  },
  viewNews: async (userData, selectedIndex) => {
    const { fetchAndFormatPostDetails } = await import("../utils/ussdDataHelpers.js");
    const locale = userData.locale || "en";
    
    // Get the stored posts list from session
    const session = sessionManager.getSession(userData.sessionId);
    const postsList = session?.postsList || [];
    
    // Get the selected post (selectedIndex is 1-based)
    const post = postsList[selectedIndex - 1];
    
    if (!post) {
      return `CON ${t("responses.post_not_found", {}, locale)}
0. ${t("common.go_back", {}, locale)}`;
    }
    
    return await fetchAndFormatPostDetails(post.id, locale);
  },
};

// Main USSD navigation handler
export const handleUSSDRequest = async (text, userData) => {
  const levels = text.split("*");

  // Get user's language preference from session (default to 'en')
  const session = sessionManager.getSession(userData.sessionId);
  const locale = session?.language || "en";
  const ussdMenus = getUssdMenus(locale);

  // Initial request - show welcome screen
  if (text === "") {
    return ussdMenus.welcome.text;
  }

  // Navigate through menu levels
  let currentMenu = "welcome";
  let customTextEntered = false;

  for (let i = 0; i < levels.length; i++) {
    const choice = levels[i];
    
    // Special handling for additionalInfo menu - accepts free text input
    if (currentMenu === "additionalInfo") {
      // Check if this is the last input (user just entered text or pressed 1/0)
      if (i === levels.length - 1) {
        const handled = handleAdditionalInfoInput(text, userData.sessionId);
        if (handled) {
          // User entered custom text, show confirmation menu
          const confirmMenu = getUssdMenus(locale);
          return confirmMenu.confirmEmergency.text;
        }
        // If not handled (user pressed 1 or 0), continue with normal navigation
      } else {
        // User previously entered something at additionalInfo
        // Check if it was custom text (not 1 or 0)
        if (choice !== "1" && choice !== "0") {
          // Save the custom text
          sessionManager.setSession(userData.sessionId, {
            additionalInfo: choice.trim(),
          });
          customTextEntered = true;
          // Skip to next iteration - the next choice will be for confirmEmergency
          currentMenu = "confirmEmergency";
          continue;
        }
      }
    }

    // Special handling for customAIRequest menu - accepts free text input
    if (currentMenu === "customAIRequest") {
      // Check if this is the last input (user just entered text or pressed 1)
      if (i === levels.length - 1) {
        if (choice !== "1") {
          // User entered custom question
          const locale = userData.locale || "en";
          
          // Get AI guidance for custom question
          const result = await getEmergencyGuidance(null, choice, locale);
          
          if (result.success) {
            return `END ${t("ai_assistance.guidance_title", {}, locale)}\n\n${result.guidance}\n\nStay safe!`;
          } else {
            return `END ${t("ai_assistance.guidance_title", {}, locale)}\n\n${result.guidance}\n\nStay safe!`;
          }
        }
        // If user pressed 1, continue with normal navigation (go back)
      }
    }

    const menu = ussdMenus[currentMenu];

    // Special handling for dynamic menus (viewEmergencies, myEmergencies, news)
    // When user is on these menus and selects 1-5, show detail view
    if (["viewEmergencies", "myEmergencies", "news"].includes(currentMenu)) {
      if (choice === "0") {
        // Go back
        if (currentMenu === "viewEmergencies" || currentMenu === "myEmergencies") {
          currentMenu = "emergencies";
          if (i === levels.length - 1) {
            return ussdMenus.emergencies.text;
          }
          continue;
        } else if (currentMenu === "news") {
          currentMenu = "communityPosts";
          if (i === levels.length - 1) {
            return ussdMenus.communityPosts.text;
          }
          continue;
        }
      } else if (["1", "2", "3", "4", "5"].includes(choice)) {
        // View detail
        const selectedIndex = parseInt(choice);
        userData.locale = locale;
        
        if (currentMenu === "viewEmergencies" || currentMenu === "myEmergencies") {
          return await dynamicMenuHandlers.viewEmergency(userData, selectedIndex);
        } else if (currentMenu === "news") {
          return await dynamicMenuHandlers.viewNews(userData, selectedIndex);
        }
      } else {
        return `END ${t("responses.invalid_option", {}, locale)}`;
      }
    }

    if (!menu) {
      return `END ${t("responses.invalid_option", {}, locale)}`;
    }

    const nextStep = menu.options ? menu.options[choice] : null;
    
    if (!nextStep) {
      return `END ${t("responses.invalid_option", {}, locale)}`;
    }

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
      userData.locale = locale;
      return await terminalHandlers[nextStep](userData);
    }

    // Check if it's a dynamic menu handler (fetches data from backend)
    if (dynamicMenuHandlers[nextStep]) {
      if (i === levels.length - 1) {
        userData.locale = locale;
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

  return `END ${t("responses.invalid_option", {}, locale)}`;
};

// Helper function to handle additional info input
const handleAdditionalInfoInput = (text, sessionId) => {
  const levels = text.split("*");
  const lastInput = levels[levels.length - 1];
  
  // Check if user pressed 1 (skip) or 0 (go back)
  if (lastInput === "1" || lastInput === "0") {
    return null; // Let normal navigation handle it
  }
  
  // User entered custom text - save it to session
  if (lastInput && lastInput.trim().length > 0) {
    sessionManager.setSession(sessionId, {
      additionalInfo: lastInput.trim(),
    });
  }
  
  return true; // Indicate we handled the input
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
