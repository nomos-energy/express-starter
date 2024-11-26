import crypto from "crypto";
import { ApiKey } from "../db/types";

export enum Role {
  ADMIN = "admin",
  USER = "user",
  PARTNER = "partner",
  THIRD_PARTY = "third_party",
}

export class ApiKeyService {
  private readonly API_KEY_LENGTH = 32;
  private readonly API_KEY_PREFIX = "nomos_";

  private readonly AVAILABLE_SCOPES = {
    [Role.ADMIN]: ["*"],
    [Role.USER]: ["subscriptions:read", "subscriptions:write"],
    [Role.PARTNER]: [
      "partner:subscriptions:read",
      "partner:subscriptions:write",
    ],
    [Role.THIRD_PARTY]: ["analytics:read", "billing:read", "usage:read"],
  };

  private hashKey(key: string): string {
    return crypto.createHash("sha256").update(key).digest("hex");
  }

  private validateScopes(role: Role, requestedScopes: string[]): void {
    const availableScopes = this.AVAILABLE_SCOPES[role];

    // If role has '*' scope, all scopes are allowed
    if (availableScopes.includes("*")) {
      return;
    }

    const invalidScopes = requestedScopes.filter(
      (scope) => !availableScopes.includes(scope)
    );

    if (invalidScopes.length > 0) {
      throw new Error(
        `Invalid scopes for role ${role}: ${invalidScopes.join(", ")}`
      );
    }
  }

  private generateSecureKey(): string {
    return crypto.randomBytes(this.API_KEY_LENGTH).toString("hex");
  }

  async generateApiKey({
    customerId,
    role,
    name,
    requestedScopes,
    partnerId,
    expiresInDays,
  }: {
    customerId?: number;
    role: Role;
    name: string;
    requestedScopes: string[];
    partnerId?: number;
    expiresInDays?: number;
  }): Promise<string> {
    // Validate requested scopes against available scopes for the role
    this.validateScopes(role, requestedScopes);

    // Generate a secure random API key
    const key = this.generateSecureKey();
    const hashedKey = this.hashKey(key);

    const apiKeyData: Omit<ApiKey, "id"> = {
      key: hashedKey,
      name,
      customerId: customerId ?? null,
      role,
      scopes: requestedScopes,
      partnerId: partnerId ?? null,
      expiresAt: expiresInDays
        ? new Date(Date.now() + expiresInDays * 86400000)
        : null,
      createdAt: new Date(),
      lastUsedAt: null,
    };

    // Return the unhashed key only once
    return `${this.API_KEY_PREFIX}${key}`;
  }
}
