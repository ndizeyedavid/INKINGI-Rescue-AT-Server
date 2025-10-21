import express from "express";
import {
  testSendSMS,
  testEmergencySMS,
  testDistressSMS,
} from "../controllers/testController.js";

const router = express.Router();

// Test SMS endpoints
router.post("/test/send-sms", testSendSMS);
router.post("/test/send-emergency-sms", testEmergencySMS);
router.post("/test/send-distress-sms", testDistressSMS);

export default router;
