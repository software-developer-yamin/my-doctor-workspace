import express from "express";
import { verifyAccessToken } from "../../middlewares/shared/jwt_helper.js";
import * as ConcentrationController from "./Concentrations.controller.js";

const router: express.Router = express.Router();

router.get("/public", ConcentrationController.GetAllConcentrations);
router.post("/", verifyAccessToken, ConcentrationController.CreateConcentration);
router.get("/", verifyAccessToken, ConcentrationController.GetAllConcentrations);
router.patch("/:id", verifyAccessToken, ConcentrationController.UpdateConcentration);
router.delete("/:id", verifyAccessToken, ConcentrationController.DeleteConcentration);

export default router;
