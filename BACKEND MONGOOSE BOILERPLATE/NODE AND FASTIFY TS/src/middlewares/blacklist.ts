let jwtToken = "";
let blacklistedToken = "";

export function setToken(token: string) {
  jwtToken = token;
}

export function getToken(): string | null {
  return jwtToken;
}

export function blacklistToken() {
  blacklistedToken = jwtToken;
}

export function isTokenBlacklisted(): boolean {
  return jwtToken === blacklistedToken;
}
