import dotenv from "dotenv";

dotenv.config({ quiet: true });

const NODE_ENVS = ["development", "test", "production"] as const;
type NodeEnv = (typeof NODE_ENVS)[number];

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Variabile d'ambiente mancante: ${name}`);
  }
  return value;
}

function parsePort(value: string | undefined): number {
  if (value === undefined) return 3000;
  const port = Number(value);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error(`PORT non valida: ${value}`);
  }
  return port;
}

function parseNodeEnv(value: string | undefined): NodeEnv {
  if (value === undefined) return "development";
  if (!NODE_ENVS.includes(value as NodeEnv)) {
    throw new Error(`NODE_ENV non valido: ${value} (ammessi: ${NODE_ENVS.join(", ")})`);
  }
  return value as NodeEnv;
}

export const env = {
  port: parsePort(process.env.PORT),
  nodeEnv: parseNodeEnv(process.env.NODE_ENV),
  dbUrl: required("DATABASE_URL"),
  corsOrigin: process.env.CORS_ORIGIN ?? "http://localhost:5173",
} as const;

export type Env = typeof env;
