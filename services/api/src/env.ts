import "dotenv/config";

function required(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const env = {
  port: Number(process.env.PORT ?? 4000),
  corsOrigin: process.env.CORS_ORIGIN ?? "*",
  databaseUrl: process.env.DATABASE_URL ?? "",
  jwtSecret: process.env.JWT_SECRET ?? "dev-secret-change-me",
  anthropicApiKey: process.env.ANTHROPIC_API_KEY ?? "",
  myraModel: process.env.MYRA_MODEL ?? "claude-sonnet-5",
};

export function assertProductionEnv() {
  required("DATABASE_URL");
  required("JWT_SECRET");
}
