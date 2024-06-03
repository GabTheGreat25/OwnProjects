import { generateToken } from "../middlewares";

export function generateAccess(payload: any = {}): { access: string } {
  const accessToken = generateToken(payload, "7d");
  return {
    access: accessToken,
  };
}
