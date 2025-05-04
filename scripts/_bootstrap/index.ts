import dotenv from "dotenv";

const baseResult = dotenv.config({
  path: ".env",
});

const productionResult = dotenv.config({
  path: ".env.production",
});

const localResult = dotenv.config({
  path: ".env.local",
});

process.env = {
  ...process.env,
  ...baseResult.parsed,
  ...productionResult.parsed,
  ...localResult.parsed,
};
