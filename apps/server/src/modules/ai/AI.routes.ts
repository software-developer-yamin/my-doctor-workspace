import express from "express";
import { verifyAccessToken } from "../../middlewares/shared/jwt_helper.js";
import {
  RecommendDoctors,
  ExplainRecommendation,
  SymptomTriage,
  Chat,
  ClearChat,
  SearchHealth,
} from "./AI.controller.js";

const router: express.Router = express.Router();

// Doctor recommendation via vector search (public)
router.post("/recommend-doctors", RecommendDoctors);
router.post("/recommend-doctors/explain", ExplainRecommendation);

// Symptom triage agent (public — no auth needed for triage)
router.post("/triage", SymptomTriage);

// Conversational AI chat (protected — per-user session)
router.post("/chat", verifyAccessToken, Chat);
router.delete("/chat", verifyAccessToken, ClearChat);

// Web search (protected)
router.post("/search", verifyAccessToken, SearchHealth);

export default router;
