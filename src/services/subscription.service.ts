import { ApiKey } from "../db/types";
import { Role } from "./api-key.service";

export class SubscriptionService {
  async getSubscription(
    apiKey: ApiKey,
    subscriptionId: string
  ): Promise<Subscription | null> {
    // First, check if the API key has the required scope
    if (!this.hasRequiredScope(apiKey, "subscriptions:read")) {
      throw new Error("Insufficient permissions");
    }

    const subscription = await this.findSubscription(subscriptionId);

    if (!subscription) {
      return null;
    }

    // Check role-based access
    switch (apiKey.role) {
      case Role.ADMIN:
        // Admins can access all subscriptions
        return subscription;

      case Role.USER:
        // Users can only access their own subscriptions
        if (subscription.userId !== apiKey.userId) {
          throw new Error("Access denied");
        }
        return subscription;

      case Role.PARTNER:
        // Partners can access subscriptions with matching partnerId
        if (subscription.partnerId !== apiKey.partnerId) {
          throw new Error("Access denied");
        }
        return subscription;

      case Role.THIRD_PARTY:
        // Third parties need specific scopes
        return subscription;

      default:
        throw new Error("Invalid role");
    }
  }

  private hasRequiredScope(apiKey: ApiKey, requiredScope: string): boolean {
    return apiKey.scopes.includes("*") || apiKey.scopes.includes(requiredScope);
  }

  private async findSubscription(id: string): Promise<Subscription | null> {
    return null;
  }
}
