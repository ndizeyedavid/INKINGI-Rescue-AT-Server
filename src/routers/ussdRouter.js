import express from "express";
import { ussdHandler } from "../controllers/ussdController.js";

const router = express.Router();

// USSD endpoint
router.post("/ussd", ussdHandler);

export default router;
