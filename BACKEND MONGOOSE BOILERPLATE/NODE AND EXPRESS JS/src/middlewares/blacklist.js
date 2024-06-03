let jwtToken = "";
let blacklistedToken = "";

export function setToken(token) {
  jwtToken = token;
}

export function getToken() {
  return jwtToken || null;
}

export function blacklistToken() {
  blacklistedToken = jwtToken;
}

export function isTokenBlacklisted() {
  return jwtToken === blacklistedToken;
}
