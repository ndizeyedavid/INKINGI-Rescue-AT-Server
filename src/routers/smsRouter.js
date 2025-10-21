import express from "express";
import {
  handleIncomingSMS,
  handleDeliveryReport,
} from "../controllers/smsController.js";

const router = express.Router();

// Webhook for incoming SMS
router.post("/sms/incoming", handleIncomingSMS);

// Webhook for SMS delivery reports
router.post("/sms/delivery-reports", handleDeliveryReport);

export default router;
