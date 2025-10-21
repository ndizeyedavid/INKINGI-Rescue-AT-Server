import AfricasTalking from "africastalking";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

// Initialize Africa's Talking
const credentials = {
  apiKey:
    process.env.AT_API_KEY ||
    "atsk_1e914afd3d722669596ab1869ac37145e9704c1cead8475e8096fa89cd110455f814dfa2",
  username: process.env.AT_USERNAME || "sandbox",
};

// Validate credentials
if (!process.env.AT_API_KEY || !process.env.AT_USERNAME) {
  console.warn(
    "⚠️  Africa's Talking credentials not found in environment variables!"
  );
  console.warn("Please set AT_API_KEY and AT_USERNAME in your .env.local file");
  console.warn(
    "Get your credentials from: https://account.africastalking.com/"
  );
}

const africastalking = AfricasTalking(credentials);
const sms = africastalking.SMS;

/**
 * Send SMS to a single recipient
 * @param {string} to - Phone number (e.g., "+250788123456")
 * @param {string} message - SMS message content
 * @param {string} from - Optional sender ID
 * @returns {Promise<Object>} SMS response
 */
export const sendSMS = async (to, message, from = null) => {
  try {
    const options = {
      to: Array.isArray(to) ? to : [to],
      message,
    };

    // Add sender ID if provided
    if (from) {
      options.from = from;
    }

    const response = await sms.send(options);
    console.log("SMS sent successfully:", response);
    return {
      success: true,
      data: response,
    };
  } catch (error) {
    console.error("Error sending SMS:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Send bulk SMS to multiple recipients
 * @param {Array<string>} recipients - Array of phone numbers
 * @param {string} message - SMS message content
 * @param {string} from - Optional sender ID
 * @returns {Promise<Object>} SMS response
 */
export const sendBulkSMS = async (recipients, message, from = null) => {
  try {
    const options = {
      to: recipients,
      message,
      enqueue: true, // For bulk SMS, enqueue for better performance
    };

    if (from) {
      options.from = from;
    }

    const response = await sms.send(options);
    console.log("Bulk SMS sent successfully:", response);
    return {
      success: true,
      data: response,
    };
  } catch (error) {
    console.error("Error sending bulk SMS:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Send premium SMS
 * @param {string} to - Phone number
 * @param {string} message - SMS message content
 * @param {string} keyword - Premium SMS keyword
 * @param {string} linkId - Link ID from incoming message
 * @param {number} retryDurationInHours - Retry duration
 * @returns {Promise<Object>} SMS response
 */
export const sendPremiumSMS = async (
  to,
  message,
  keyword,
  linkId,
  retryDurationInHours = 1
) => {
  try {
    const options = {
      to: [to],
      message,
      keyword,
      linkId,
      retryDurationInHours,
    };

    const response = await sms.send(options);
    console.log("Premium SMS sent successfully:", response);
    return {
      success: true,
      data: response,
    };
  } catch (error) {
    console.error("Error sending premium SMS:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Fetch SMS messages (for incoming SMS)
 * @param {string} lastReceivedId - Last received message ID
 * @returns {Promise<Object>} Messages response
 */
export const fetchMessages = async (lastReceivedId = null) => {
  try {
    const options = lastReceivedId ? { lastReceivedId } : {};
    const messages = await sms.fetchMessages(options);
    return {
      success: true,
      data: messages,
    };
  } catch (error) {
    console.error("Error fetching messages:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Create SMS subscription
 * @param {string} shortCode - Short code
 * @param {string} keyword - Keyword
 * @param {string} phoneNumber - Phone number to subscribe
 * @returns {Promise<Object>} Subscription response
 */
export const createSubscription = async (shortCode, keyword, phoneNumber) => {
  try {
    const response = await sms.createSubscription({
      shortCode,
      keyword,
      phoneNumber,
    });
    return {
      success: true,
      data: response,
    };
  } catch (error) {
    console.error("Error creating subscription:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// SMS Templates for INKINGI Rescue
export const SMS_TEMPLATES = {
  EMERGENCY_CONFIRMATION: (emergencyType, referenceId) =>
    `INKINGI Rescue: Your ${emergencyType} emergency has been reported successfully. Reference: ${referenceId}. Help is on the way. Stay safe!`,

  DISTRESS_ALERT: (location) =>
    `INKINGI Rescue DISTRESS ALERT: Emergency services have been notified. Your location: ${location}. Help is on the way. Stay calm and safe.`,

  EMERGENCY_UPDATE: (referenceId, status) =>
    `INKINGI Rescue: Emergency ${referenceId} status update - ${status}`,

  RESCUE_TEAM_DISPATCH: (emergencyType, location, phoneNumber) =>
    `INKINGI Rescue: ${emergencyType} emergency reported at ${location}. Contact: ${phoneNumber}. Respond immediately.`,

  WELCOME: (name) =>
    `Welcome to INKINGI Rescue, ${name}! Dial *XXX# for emergency services. Stay safe!`,
};
