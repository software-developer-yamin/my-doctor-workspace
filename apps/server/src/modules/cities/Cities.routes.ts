import express from "express";
import { verifyAccessToken } from "../../middlewares/shared/jwt_helper.js";
import * as CityController from "./Cities.controller.js";

const router: express.Router = express.Router();

router.get("/public", CityController.GetAllCities);
router.post("/", verifyAccessToken, CityController.CreateCity);
router.get("/", verifyAccessToken, CityController.GetAllCities);
router.patch("/:id", verifyAccessToken, CityController.UpdateCity);
router.delete("/:id", verifyAccessToken, CityController.DeleteCity);

export default router;
