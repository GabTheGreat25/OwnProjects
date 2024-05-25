let latestBlacklistedToken = "";

export function addTokenToBlacklist(token: string) {
  latestBlacklistedToken = token;
}

export function isTokenBlacklisted(token: string) {
  return token === latestBlacklistedToken;
}
