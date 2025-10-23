import { sessionManager } from "./sessionManager.js";
import {
  getUserEmergencies,
  getEmergencies,
  getPosts,
} from "../services/backendApiService.js";

/**
 * Fetch and format all emergencies for USSD display (View Emergencies)
 * @returns {Promise<string>} Formatted USSD menu text
 */
export const fetchAndFormatAllEmergencies = async (sessionId) => {
  try {
    const result = await getEmergencies({ limit: 5 });

    if (!result.success || !result.data?.emergencies) {
      return `CON No emergencies found
0. Go back`;
    }

    const emergencies = result.data.emergencies.slice(0, 5); // Show max 5

    if (emergencies.length === 0) {
      return `CON No emergencies found
0. Go back`;
    }

    // Store emergencies in session for later selection
    sessionManager.setSession(sessionId, {
      emergenciesList: emergencies,
    });

    let menuText = `CON All Emergencies (${result.data.total})\n`;

    emergencies.forEach((emergency, index) => {
      const type = emergency.type || "Emergency";
      const status = emergency.status || "PENDING";
      const id = emergency.id?.substring(0, 8) || "N/A";
      const userName = emergency.user
        ? `${emergency.user.firstName} ${emergency.user.lastName}`
        : "Unknown";
      menuText += `${index + 1}. ${type} - ${status}\n   By: ${userName}\n`;
    });

    menuText += `0. Go back`;

    return menuText;
  } catch (error) {
    console.error("Error fetching all emergencies:", error);
    return `CON Unable to load emergencies
0. Go back`;
  }
};

/**
 * Fetch and format user's emergencies for USSD display (My Emergencies)
 * @param {string} phoneNumber - User phone number
 * @returns {Promise<string>} Formatted USSD menu text
 */
export const fetchAndFormatUserEmergencies = async (phoneNumber, sessionId) => {
  try {
    const result = await getUserEmergencies(phoneNumber);

    if (!result.success || !result.data?.emergencies) {
      return `CON No emergencies found
0. Go back`;
    }

    const emergencies = result.data.emergencies.slice(0, 5); // Show max 5

    if (emergencies.length === 0) {
      return `CON You have no emergencies
0. Go back`;
    }

    // Store emergencies in session for later selection
    sessionManager.setSession(sessionId, {
      emergenciesList: emergencies,
    });

    let menuText = `CON Your Emergencies (${result.data.total})\n`;

    emergencies.forEach((emergency, index) => {
      const type = emergency.type || "Emergency";
      const status = emergency.status || "PENDING";
      const id = emergency.id?.substring(0, 8) || "N/A";
      menuText += `${index + 1}. ${type} - ${status} (${id}...)\n`;
    });

    menuText += `0. Go back`;

    return menuText;
  } catch (error) {
    console.error("Error fetching user emergencies:", error);
    return `CON Unable to load emergencies
0. Go back`;
  }
};

/**
 * Fetch and format posts for USSD display
 * @param {string} sessionId - Session ID
 * @returns {Promise<string>} Formatted USSD menu text
 */
export const fetchAndFormatPosts = async (sessionId) => {
  try {
    const result = await getPosts({ limit: 5 });

    if (!result.success || !result.data?.posts) {
      return `CON No posts available
0. Go back`;
    }

    const posts = result.data.posts.slice(0, 5);

    if (posts.length === 0) {
      return `CON No posts available
0. Go back`;
    }

    // Store posts in session for later selection
    sessionManager.setSession(sessionId, {
      postsList: posts,
    });

    let menuText = `CON Community Posts\n`;

    posts.forEach((post, index) => {
      const title = post.title?.substring(0, 35) || "Post";
      menuText += `${index + 1}. ${title}...\n`;
    });

    menuText += `0. Go back`;

    return menuText;
  } catch (error) {
    console.error("Error fetching posts:", error);
    return `CON Unable to load posts
0. Go back`;
  }
};

/**
 * Fetch and format emergency details for USSD display
 * @param {string} emergencyId - Emergency ID
 * @returns {Promise<string>} Formatted USSD menu text
 */
export const fetchAndFormatEmergencyDetails = async (emergencyId) => {
  try {
    const { getEmergencyById } = await import(
      "../services/backendApiService.js"
    );
    const result = await getEmergencyById(emergencyId);

    if (!result.success || !result.data) {
      return `CON Emergency not found
0. Go back`;
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

    let menuText = `CON Emergency Details\n`;
    menuText += `Type: ${type}\n`;
    menuText += `Status: ${status}\n`;
    menuText += `Priority: ${priority}\n`;
    menuText += `Location: ${address}\n`;
    menuText += `Reported by: ${userName}\n`;
    menuText += `Phone: ${userPhone}\n`;
    menuText += `Time: ${createdAt}\n`;
    menuText += `\n0. Go back`;

    return menuText;
  } catch (error) {
    console.error("Error fetching emergency details:", error);
    return `CON Unable to load emergency details
0. Go back`;
  }
};

/**
 * Fetch and format post details for USSD display
 * @param {string} postId - Post ID
 * @returns {Promise<string>} Formatted USSD menu text
 */
export const fetchAndFormatPostDetails = async (postId) => {
  try {
    const { getPostById } = await import("../services/backendApiService.js");
    const result = await getPostById(postId);

    if (!result.success || !result.data) {
      return `CON Post not found
0. Go back`;
    }

    const post = result.data;
    const title = post.title || "Untitled";
    const content = post.content?.substring(0, 200) || "No content available";
    const author = post.author || post.createdBy || "Unknown";
    const createdAt = post.createdAt
      ? new Date(post.createdAt).toLocaleString()
      : "N/A";

    let menuText = `CON Post Details\n`;
    menuText += `Title: ${title}\n\n`;
    menuText += `${content}${content.length >= 200 ? "..." : ""}\n\n`;
    menuText += `By: ${author}\n`;
    menuText += `Posted: ${createdAt}\n`;
    menuText += `\n0. Go back`;

    return menuText;
  } catch (error) {
    console.error("Error fetching post details:", error);
    return `CON Unable to load post details
0. Go back`;
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
