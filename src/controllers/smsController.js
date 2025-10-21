import { sendSMS, sendBulkSMS, SMS_TEMPLATES } from "../services/smsService.js";
import { SMS_CONFIG } from "../config/constants.js";

/**
 * Send emergency confirmation SMS
 * @param {string} phoneNumber - Recipient phone number
 * @param {string} emergencyType - Type of emergency
 * @param {string} referenceId - Emergency reference ID
 */
export const sendEmergencyConfirmation = async (
  phoneNumber,
  emergencyType,
  referenceId
) => {
  const message = SMS_TEMPLATES.EMERGENCY_CONFIRMATION(
    emergencyType,
    referenceId
  );
  return await sendSMS(phoneNumber, message, SMS_CONFIG.SENDER_ID);
};

/**
 * Send distress alert SMS
 * @param {string} phoneNumber - Recipient phone number
 * @param {string} location - User location
 */
export const sendDistressAlert = async (phoneNumber, location = "Unknown") => {
  const message = SMS_TEMPLATES.DISTRESS_ALERT(location);
  return await sendSMS(phoneNumber, message, SMS_CONFIG.SENDER_ID);
};

/**
 * Send emergency update SMS
 * @param {string} phoneNumber - Recipient phone number
 * @param {string} referenceId - Emergency reference ID
 * @param {string} status - Emergency status
 */
export const sendEmergencyUpdate = async (
  phoneNumber,
  referenceId,
  status
) => {
  const message = SMS_TEMPLATES.EMERGENCY_UPDATE(referenceId, status);
  return await sendSMS(phoneNumber, message, SMS_CONFIG.SENDER_ID);
};

/**
 * Notify rescue team about emergency
 * @param {Array<string>} teamNumbers - Array of rescue team phone numbers
 * @param {string} emergencyType - Type of emergency
 * @param {string} location - Emergency location
 * @param {string} reporterPhone - Reporter's phone number
 */
export const notifyRescueTeam = async (
  teamNumbers,
  emergencyType,
  location,
  reporterPhone
) => {
  const message = SMS_TEMPLATES.RESCUE_TEAM_DISPATCH(
    emergencyType,
    location,
    reporterPhone
  );
  return await sendBulkSMS(teamNumbers, message, SMS_CONFIG.SENDER_ID);
};

/**
 * Send welcome SMS to new user
 * @param {string} phoneNumber - Recipient phone number
 * @param {string} name - User name
 */
export const sendWelcomeSMS = async (phoneNumber, name = "User") => {
  const message = SMS_TEMPLATES.WELCOME(name);
  return await sendSMS(phoneNumber, message, SMS_CONFIG.SENDER_ID);
};

/**
 * Handle incoming SMS (webhook handler)
 */
export const handleIncomingSMS = async (req, res) => {
  try {
    const { from, to, text, date, id, linkId } = req.body;

    console.log("Incoming SMS:", {
      from,
      to,
      text,
      date,
      id,
    });

    // TODO: Process incoming SMS
    // - Parse commands
    // - Store in database
    // - Trigger appropriate actions

    res.status(200).send("SMS received");
  } catch (error) {
    console.error("Error handling incoming SMS:", error);
    res.status(500).send("Error processing SMS");
  }
};

/**
 * Handle SMS delivery reports (webhook handler)
 */
export const handleDeliveryReport = async (req, res) => {
  try {
    const { id, status, phoneNumber, networkCode, failureReason } = req.body;

    console.log("SMS Delivery Report:", {
      id,
      status,
      phoneNumber,
      networkCode,
      failureReason,
    });

    // TODO: Update SMS status in database
    // - Mark as delivered/failed
    // - Log failure reasons
    // - Retry if necessary

    res.status(200).send("Delivery report received");
  } catch (error) {
    console.error("Error handling delivery report:", error);
    res.status(500).send("Error processing delivery report");
  }
};
