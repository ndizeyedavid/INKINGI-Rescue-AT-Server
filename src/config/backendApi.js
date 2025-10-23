import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

// Backend API Configuration
export const BACKEND_API_CONFIG = {
  BASE_URL: process.env.BACKEND_API_URL || "http://localhost:3000",
  TIMEOUT: 10000, // 10 seconds
  HEADERS: {
    "Content-Type": "application/json",
  },
};

// Backend API Endpoints
export const BACKEND_ENDPOINTS = {
  // Emergency endpoints
  REPORT_EMERGENCY: "/ussd/report-emergency",
  GET_EMERGENCIES: "/ussd/emergencies",
  GET_EMERGENCY_BY_ID: "/ussd/emergency",
  GET_USER_EMERGENCIES: "/ussd/user-emergencies",

  // Distress endpoints
  TRIGGER_DISTRESS: "/ussd/distress",

  // Community posts endpoints
  GET_POSTS: "/ussd/posts",
  GET_POST_BY_ID: "/ussd/posts",

  // User endpoints
  CREATE_USER: "/ussd/create-user",
  GET_USER: "/ussd/user",
};
