import { Injectable } from "@nestjs/common";

@Injectable()
export class TokenService {
  private token: string;
  private blacklistedToken: string;

  setToken(token: string) {
    this.token = token;
  }

  getToken(): string | null {
    return this.token;
  }

  blacklistToken() {
    this.blacklistedToken = this.token;
  }

  isTokenBlacklisted(): boolean {
    return this.token === this.blacklistedToken;
  }
}
