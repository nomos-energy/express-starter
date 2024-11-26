import { Request } from "express";
import { ApiKey } from "../db/types";

export interface AuthenticatedRequest extends Request {
  apiKey?: ApiKey;
}
