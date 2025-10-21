// Request logging middleware
export const requestLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  
  // Log USSD request details
  if (req.path === "/ussd" && req.body) {
    console.log("USSD Request:", {
      sessionId: req.body.sessionId,
      phoneNumber: req.body.phoneNumber,
      text: req.body.text,
    });
  }
  
  next();
};
