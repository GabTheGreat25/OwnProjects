let latestBlacklistedToken = "";

const addTokenToBlacklist = (token) => {
  latestBlacklistedToken = token;
};

const isTokenBlacklisted = (token) => {
  return token === latestBlacklistedToken;
};

export { addTokenToBlacklist, isTokenBlacklisted };
