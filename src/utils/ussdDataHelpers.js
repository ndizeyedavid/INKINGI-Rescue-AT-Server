import { sessionManager } from "./sessionManager.js";
import {
  getUserEmergencies,
  getEmergencies,
  getPosts,
} from "../services/backendApiService.js";
import { t } from "../config/i18n.js";

/**
 * Fetch and format all emergencies for USSD display (View Emergencies)
 * @returns {Promise<string>} Formatted USSD menu text
 */
export const fetchAndFormatAllEmergencies = async (sessionId, locale = "en") => {
  try {
    const result = await getEmergencies({ limit: 5 });

    if (!result.success || !result.data?.emergencies) {
      return `CON ${t("responses.no_emergencies", {}, locale)}
0. ${t("common.go_back", {}, locale)}`;
    }

    const emergencies = result.data.emergencies.slice(0, 5); // Show max 5

    if (emergencies.length === 0) {
      return `CON ${t("responses.no_emergencies", {}, locale)}
0. ${t("common.go_back", {}, locale)}`;
    }

    // Store emergencies in session for later selection
    sessionManager.setSession(sessionId, {
      emergenciesList: emergencies,
    });

    let menuText = `CON ${t("emergency_list.all_emergencies", { count: result.data.total }, locale)}\n`;

    emergencies.forEach((emergency, index) => {
      const type = emergency.type || "Emergency";
      const status = emergency.status || "PENDING";
      const id = emergency.id?.substring(0, 8) || "N/A";
      const userName = emergency.user
        ? `${emergency.user.firstName} ${emergency.user.lastName}`
        : "Unknown";
      menuText += `${index + 1}. ${type} - ${status}\n   ${t("emergency_list.by", {}, locale)}: ${userName}\n`;
    });

    menuText += `0. ${t("common.go_back", {}, locale)}`;

    return menuText;
  } catch (error) {
    console.error("Error fetching all emergencies:", error);
    return `CON ${t("responses.unable_to_load", { item: "emergencies" }, locale)}
0. ${t("common.go_back", {}, locale)}`;
  }
};

/**
 * Fetch and format user's emergencies for USSD display (My Emergencies)
 * @param {string} phoneNumber - User phone number
 * @returns {Promise<string>} Formatted USSD menu text
 */
export const fetchAndFormatUserEmergencies = async (phoneNumber, sessionId, locale = "en") => {
  try {
    const result = await getUserEmergencies(phoneNumber);

    if (!result.success || !result.data?.emergencies) {
      return `CON ${t("responses.no_emergencies", {}, locale)}
0. ${t("common.go_back", {}, locale)}`;
    }

    const emergencies = result.data.emergencies.slice(0, 5); // Show max 5

    if (emergencies.length === 0) {
      return `CON ${t("responses.no_user_emergencies", {}, locale)}
0. ${t("common.go_back", {}, locale)}`;
    }

    // Store emergencies in session for later selection
    sessionManager.setSession(sessionId, {
      emergenciesList: emergencies,
    });

    let menuText = `CON ${t("emergency_list.your_emergencies", { count: result.data.total }, locale)}\n`;

    emergencies.forEach((emergency, index) => {
      const type = emergency.type || "Emergency";
      const status = emergency.status || "PENDING";
      const id = emergency.id?.substring(0, 8) || "N/A";
      menuText += `${index + 1}. ${type} - ${status} (${id}...)\n`;
    });

    menuText += `0. ${t("common.go_back", {}, locale)}`;

    return menuText;
  } catch (error) {
    console.error("Error fetching user emergencies:", error);
    return `CON ${t("responses.unable_to_load", { item: "emergencies" }, locale)}
0. ${t("common.go_back", {}, locale)}`;
  }
};

/**
 * Fetch and format posts for USSD display
 * @param {string} sessionId - Session ID
 * @returns {Promise<string>} Formatted USSD menu text
 */
export const fetchAndFormatPosts = async (sessionId, locale = "en") => {
  try {
    const result = await getPosts({ limit: 5 });

    if (!result.success || !result.data?.posts) {
      return `CON ${t("responses.no_posts", {}, locale)}
0. ${t("common.go_back", {}, locale)}`;
    }

    const posts = result.data.posts.slice(0, 5);

    if (posts.length === 0) {
      return `CON ${t("responses.no_posts", {}, locale)}
0. ${t("common.go_back", {}, locale)}`;
    }

    // Store posts in session for later selection
    sessionManager.setSession(sessionId, {
      postsList: posts,
    });

    let menuText = `CON ${t("community_posts.title", {}, locale)}\n`;

    posts.forEach((post, index) => {
      const title = post.title?.substring(0, 35) || "Post";
      menuText += `${index + 1}. ${title}...\n`;
    });

    menuText += `0. ${t("common.go_back", {}, locale)}`;

    return menuText;
  } catch (error) {
    console.error("Error fetching posts:", error);
    return `CON ${t("responses.unable_to_load", { item: "posts" }, locale)}
0. ${t("common.go_back", {}, locale)}`;
  }
};

/**
 * Fetch and format emergency details for USSD display
 * @param {string} emergencyId - Emergency ID
 * @returns {Promise<string>} Formatted USSD menu text
 */
export const fetchAndFormatEmergencyDetails = async (emergencyId, locale = "en") => {
  try {
    const { getEmergencyById } = await import(
      "../services/backendApiService.js"
    );
    const result = await getEmergencyById(emergencyId);

    if (!result.success || !result.data) {
      return `CON ${t("responses.emergency_not_found", {}, locale)}
0. ${t("common.go_back", {}, locale)}`;
    }

    const emergency = result.data;
    const type = emergency.type || "N/A";
    const status = emergency.status || "N/A";
    const priority = emergency.priority || "N/A";
    const description = emergency.description || "No description";
    const address = emergency.address || "Unknown location";
    const createdAt = emergency.createdAt
      ? new Date(emergency.createdAt).toLocaleString()
      : "N/A";
    const userName = emergency.user
      ? `${emergency.user.firstName} ${emergency.user.lastName}`
      : "Unknown";
    const userPhone = emergency.user?.phoneNumber || "N/A";

    let menuText = `CON ${t("emergency_details.title", {}, locale)}\n`;
    menuText += `${t("emergency_details.type", {}, locale)}: ${type}\n`;
    menuText += `${t("emergency_details.status", {}, locale)}: ${status}\n`;
    menuText += `${t("emergency_details.priority", {}, locale)}: ${priority}\n`;
    menuText += `${t("emergency_details.location", {}, locale)}: ${address}\n`;
    menuText += `${t("emergency_details.reported_by", {}, locale)}: ${userName}\n`;
    menuText += `${t("emergency_details.phone", {}, locale)}: ${userPhone}\n`;
    menuText += `${t("emergency_details.time", {}, locale)}: ${createdAt}\n`;
    menuText += `\n0. ${t("common.go_back", {}, locale)}`;

    return menuText;
  } catch (error) {
    console.error("Error fetching emergency details:", error);
    return `CON ${t("responses.unable_to_load", { item: "emergency details" }, locale)}
0. ${t("common.go_back", {}, locale)}`;
  }
};

/**
 * Fetch and format post details for USSD display
 * @param {string} postId - Post ID
 * @returns {Promise<string>} Formatted USSD menu text
 */
export const fetchAndFormatPostDetails = async (postId, locale = "en") => {
  try {
    const { getPostById } = await import("../services/backendApiService.js");
    const result = await getPostById(postId);

    if (!result.success || !result.data) {
      return `CON ${t("responses.post_not_found", {}, locale)}
0. ${t("common.go_back", {}, locale)}`;
    }

    const post = result.data;
    const title = post.title || "Untitled";
    const content = post.content?.substring(0, 200) || "No content available";
    const author = post.author || post.createdBy || "Unknown";
    const createdAt = post.createdAt
      ? new Date(post.createdAt).toLocaleString()
      : "N/A";

    let menuText = `CON ${t("post_details.title", {}, locale)}\n`;
    menuText += `Title: ${title}\n\n`;
    menuText += `${content}${content.length >= 200 ? "..." : ""}\n\n`;
    menuText += `${t("post_details.by", {}, locale)}: ${author}\n`;
    menuText += `${t("post_details.posted", {}, locale)}: ${createdAt}\n`;
    menuText += `\n0. ${t("common.go_back", {}, locale)}`;

    return menuText;
  } catch (error) {
    console.error("Error fetching post details:", error);
    return `CON ${t("responses.unable_to_load", { item: "post details" }, locale)}
0. ${t("common.go_back", {}, locale)}`;
  }
};

/**
 * Store selected item in session for later retrieval
 * @param {string} sessionId - Session ID
 * @param {string} itemType - Type of item (emergency, news, event)
 * @param {Object} item - Item data
 */
export const storeSelectedItem = (sessionId, itemType, item) => {
  sessionManager.setSession(sessionId, {
    [`selected_${itemType}`]: item,
  });
};

/**
 * Get selected item from session
 * @param {string} sessionId - Session ID
 * @param {string} itemType - Type of item (emergency, news, event)
 * @returns {Object|null} Item data or null
 */
export const getSelectedItem = (sessionId, itemType) => {
  const session = sessionManager.getSession(sessionId);
  return session?.[`selected_${itemType}`] || null;
};
