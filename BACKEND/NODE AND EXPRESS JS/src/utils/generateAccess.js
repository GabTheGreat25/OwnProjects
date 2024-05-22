import generateToken from "./generateToken.js";

function generateAccess(payload = {}) {
  const accessToken = generateToken(payload, "30s");
  return {
    access: accessToken,
  };
}

export default generateAccess;
