import crypto from "crypto";
import { ApiKey } from "../db/types";
import { ApiKeyService } from "../services/api-key-service";
import { Request, Response, NextFunction } from "express";
import { db } from "../db";
import { eq } from "drizzle-orm";
import * as schema from "../db/schema";
import { AuthenticatedRequest } from "../types/request";

export class AuthMiddleware {
  constructor(private readonly apiKeyService: ApiKeyService) {}

  authenticate = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Missing or invalid API key" });
    }

    // Remove 'Bearer ' prefix
    const apiKey = authHeader.slice(7);

    try {
      const validatedKey = await this.validateApiKey(apiKey);

      if (!validatedKey) {
        return res.status(401).json({ error: "Invalid API key" });
      }

      // Check if API key is expired
      if (validatedKey.expiresAt && validatedKey.expiresAt < new Date()) {
        return res.status(401).json({ error: "API key has expired" });
      }

      // Attach API key data to request
      req.apiKey = validatedKey;

      // Update last used timestamp
      await this.updateApiKeyLastUsed(validatedKey.id);

      next();
    } catch (error) {
      return res.status(401).json({ error: "Invalid API key" });
    }
  };

  private async validateApiKey(apiKey: string): Promise<ApiKey | null> {
    if (!apiKey.startsWith(ApiKeyService.API_KEY_PREFIX)) {
      return null;
    }

    const key = apiKey.slice(3); // Remove 'nomos_' prefix
    const hashedKey = crypto.createHash("sha256").update(key).digest("hex");

    const dbApiKey = await db.query.apiKeys.findFirst({
      where: eq(schema.apiKeys.key, hashedKey),
    });

    return dbApiKey ?? null;
  }

  private async updateApiKeyLastUsed(apiKeyId: number): Promise<void> {
    // Update last used timestamp in database
  }
}
