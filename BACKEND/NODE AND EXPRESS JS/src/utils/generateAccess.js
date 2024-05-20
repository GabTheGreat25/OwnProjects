import generateToken from "./generateToken.js";

export default (payload = {}) => {
  return generateToken(payload, "30s");
};
