import { config } from "dotenv";
import { resolve } from "path";

// Load .env file for API routes
config({ path: resolve(process.cwd(), ".env") });

export const serverEnv = {
  GOOGLE_GENAI_API_KEY: process.env.EXPO_PUBLIC_GOOGLE_GENAI_API_KEY ?? "",
  IMG_API_URL: process.env.EXPO_PUBLIC_IMG_API_URL ?? "",
  IMG_API_TOKEN: process.env.EXPO_PUBLIC_IMG_API_TOKEN ?? "",
} as const;

export function validateEnv(keys: (keyof typeof serverEnv)[]) {
  const missing = keys.filter((key) => !serverEnv[key]);
  if (missing.length > 0) {
    throw new Error(`Missing environment variables: ${missing.join(", ")}`);
  }
}
