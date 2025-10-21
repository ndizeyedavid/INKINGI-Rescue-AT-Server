import express from "express";
import ussdRouter from "./routers/ussdRouter.js";
import smsRouter from "./routers/smsRouter.js";
import testRouter from "./routers/testRouter.js";
import { requestLogger } from "./middlewares/requestLogger.js";
import { errorHandler, notFoundHandler } from "./middlewares/errorHandler.js";

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

// Health check route
app.get("/", (req, res) => {
  res.json({
    status: "success",
    message: "INKINGI Rescue USSD & SMS Server is Running!",
    version: "1.0.0",
    endpoints: {
      ussd: "/ussd",
      sms_incoming: "/sms/incoming",
      sms_delivery: "/sms/delivery-reports",
      test_sms: "/test/send-sms",
      test_emergency: "/test/send-emergency-sms",
      test_distress: "/test/send-distress-sms",
    },
  });
});

// Routes
app.use("/", ussdRouter);
app.use("/", smsRouter);
app.use("/", testRouter);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 INKINGI Rescue Server running on port ${PORT}`);
  console.log(`📱 USSD endpoint: http://localhost:${PORT}/ussd`);
  console.log(`📧 SMS incoming: http://localhost:${PORT}/sms/incoming`);
  console.log(`📊 SMS delivery: http://localhost:${PORT}/sms/delivery-reports`);
});
