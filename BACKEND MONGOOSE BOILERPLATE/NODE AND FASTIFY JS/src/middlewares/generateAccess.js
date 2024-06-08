import { generateToken } from "../middlewares/index.js";

export function generateAccess(payload = {}) {
  const accessToken = generateToken(payload, "7d");
  return {
    access: accessToken,
  };
}
