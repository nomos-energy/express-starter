import { InferSelectModel } from "drizzle-orm";

import * as schema from "./schema";

export type ApiKey = InferSelectModel<typeof schema.apiKeys>;
export type Partner = InferSelectModel<typeof schema.partners>;
export type Customer = InferSelectModel<typeof schema.customers>;
