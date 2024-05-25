import generateToken from "./generateToken.js";

export default function generateAccess(payload = {}) {
  const accessToken = generateToken(payload, "7d");
  return {
    access: accessToken,
  };
}
