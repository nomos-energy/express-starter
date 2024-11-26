import { Router } from "express";
import { AuthMiddleware } from "../middlewares/auth";
import { ApiKeyService } from "../services/api-key.service";

const adminRoutes = Router();
const apiKeyService = new ApiKeyService();
const authMiddleware = new AuthMiddleware(apiKeyService);

adminRoutes.get("/", authMiddleware.authenticate, (req, res) => {
  res.send("Hello from the Admin Route");
});

export default adminRoutes;
