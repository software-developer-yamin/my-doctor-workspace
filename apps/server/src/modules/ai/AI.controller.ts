import { Request, Response, NextFunction } from "express";
import { sendResponse } from "../../utils/sendResponse.js";
import { recommendDoctors, explainRecommendation } from "../../base/doctor-recommendation.js";
import { runSymptomTriage } from "../../base/symptom-triage.js";
import { chat, clearSession } from "../../base/conversational-ai.js";
import { searchHealthInfo } from "../../base/web-search.js";
import { AuthRequest } from "../../middlewares/shared/jwt_helper.js";

export const RecommendDoctors = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { query, limit } = req.body as { query: string; limit?: number };
    if (!query) {
      res.status(400).json({ success: false, error: { message: "query is required" } });
      return;
    }
    const results = await recommendDoctors(query, limit ?? 5);
    return sendResponse(res, results, "Doctor recommendations fetched");
  } catch (e) {
    next(e);
  }
};

export const ExplainRecommendation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { query, doctorProfile } = req.body as {
      query: string;
      doctorProfile: Record<string, unknown>;
    };
    if (!query || !doctorProfile) {
      res.status(400).json({ success: false, error: { message: "query and doctorProfile are required" } });
      return;
    }
    const explanation = await explainRecommendation(query, doctorProfile);
    return sendResponse(res, { explanation }, "Recommendation explanation generated");
  } catch (e) {
    next(e);
  }
};

export const SymptomTriage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { message } = req.body as { message: string };
    if (!message) {
      res.status(400).json({ success: false, error: { message: "message is required" } });
      return;
    }
    const result = await runSymptomTriage(message);
    return sendResponse(res, result, "Triage completed");
  } catch (e) {
    next(e);
  }
};

export const Chat = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { message } = req.body as { message: string };
    const sessionId = req.payload?.aud ?? req.ip ?? "anonymous";
    if (!message) {
      res.status(400).json({ success: false, error: { message: "message is required" } });
      return;
    }
    const response = await chat(sessionId as string, message);
    return sendResponse(res, { response, sessionId }, "Chat response generated");
  } catch (e) {
    next(e);
  }
};

export const ClearChat = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const sessionId = req.payload?.aud ?? req.ip ?? "anonymous";
    clearSession(sessionId as string);
    return sendResponse(res, null, "Chat session cleared");
  } catch (e) {
    next(e);
  }
};

export const SearchHealth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { query } = req.body as { query: string };
    if (!query) {
      res.status(400).json({ success: false, error: { message: "query is required" } });
      return;
    }
    const result = await searchHealthInfo(query);
    return sendResponse(res, { result }, "Health search completed");
  } catch (e) {
    next(e);
  }
};
