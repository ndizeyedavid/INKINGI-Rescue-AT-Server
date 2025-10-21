import { sendSMS, SMS_TEMPLATES } from "../services/smsService.js";
import { SMS_CONFIG } from "../config/constants.js";

/**
 * Test endpoint to send SMS
 * POST /test/send-sms
 * Body: { phoneNumber: "+250788123456", message: "Test message" }
 */
export const testSendSMS = async (req, res) => {
  try {
    const { phoneNumber, message } = req.body;

    // Validate input
    if (!phoneNumber) {
      return res.status(400).json({
        success: false,
        error: "Phone number is required",
      });
    }

    if (!message) {
      return res.status(400).json({
        success: false,
        error: "Message is required",
      });
    }

    // Send SMS
    const result = await sendSMS(phoneNumber, message, SMS_CONFIG.SENDER_ID);

    if (result.success) {
      return res.status(200).json({
        success: true,
        message: "SMS sent successfully",
        data: result.data,
      });
    } else {
      return res.status(500).json({
        success: false,
        error: result,
      });
    }
  } catch (error) {
    console.error("Error in testSendSMS:", error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * Test endpoint with predefined emergency SMS
 * POST /test/send-emergency-sms
 * Body: { phoneNumber: "+250788123456" }
 */
export const testEmergencySMS = async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
      return res.status(400).json({
        success: false,
        error: "Phone number is required",
      });
    }

    // Generate test reference ID
    const referenceId = `INK${Date.now().toString().slice(-8)}`;
    const message = SMS_TEMPLATES.EMERGENCY_CONFIRMATION("Fire", referenceId);

    const result = await sendSMS(phoneNumber, message, SMS_CONFIG.SENDER_ID);

    if (result.success) {
      return res.status(200).json({
        success: true,
        message: "Emergency SMS sent successfully",
        referenceId,
        data: result.data,
      });
    } else {
      return res.status(500).json({
        success: false,
        error: result.error,
      });
    }
  } catch (error) {
    console.error("Error in testEmergencySMS:", error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * Test endpoint for distress alert SMS
 * POST /test/send-distress-sms
 * Body: { phoneNumber: "+250788123456" }
 */
export const testDistressSMS = async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
      return res.status(400).json({
        success: false,
        error: "Phone number is required",
      });
    }

    const message = SMS_TEMPLATES.DISTRESS_ALERT("Test Location - Kigali");

    const result = await sendSMS(phoneNumber, message, SMS_CONFIG.SENDER_ID);

    if (result.success) {
      return res.status(200).json({
        success: true,
        message: "Distress SMS sent successfully",
        data: result.data,
      });
    } else {
      return res.status(500).json({
        success: false,
        error: result.error,
      });
    }
  } catch (error) {
    console.error("Error in testDistressSMS:", error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
