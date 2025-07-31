export class TokenService {
  static getToken(): string | null {
    return localStorage.getItem("app.pos.graphland.dev.accessToken") || null;
  }

  static setToken(token: string): void {
    localStorage.setItem("app.pos.graphland.dev.accessToken", token);
  }

  static removeToken(): void {
    localStorage.removeItem("app.pos.graphland.dev.accessToken");
  }
}
