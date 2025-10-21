import express from "express";
import ussdRouter from "./routers/ussdRouter.js";
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
    message: "INKINGI Rescue USSD Server is Running!",
    version: "1.0.0",
  });
});

// Routes
app.use("/", ussdRouter);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 INKINGI Rescue Server running on port ${PORT}`);
  console.log(`📱 USSD endpoint: http://localhost:${PORT}/ussd`);
});
