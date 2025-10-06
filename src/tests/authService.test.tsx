import { describe, it, expect, vi } from "vitest";
import * as authService from "../core/services/authService";

vi.mock("../infrastructure/http/apiPost", () => ({
  apiPost: vi.fn(),
}));

vi.mock("../core/utils/decodeToken", () => ({
  decodeToken: vi.fn(),
}));

/**
 * Security tests for authService to ensure safe handling of credentials and error propagation.
 * These tests verify that passwords are sent securely in the request body and not in the URL,
 * and that errors from axios are properly propagated and wrapped in a readable format.
 */
describe("Security tests for authService", () => {
  it('sends credentials using "current_password" in the request body and does not leak password in URL', async () => {
    const { apiPost } = await import("../infrastructure/http/apiPost");
    const { decodeToken } = await import("../core/utils/decodeToken");
    const apiPostMock = vi.mocked(apiPost);
    const decodeTokenMock = vi.mocked(decodeToken);
    const mockResponse = {
      message: "ok",
      accessToken: "acctoken",
      refreshToken: "rftoken",
    };

    decodeTokenMock.mockReturnValue({
      sub: "user-id",
      fullname: "Test User",
      email: "user@example.com",
      role: "USER",
      exp: Date.now() / 1000 + 3600,
      iat: Date.now() / 1000,
    });

    apiPostMock.mockResolvedValueOnce(mockResponse);

    const email = "user@example.com";
    const password = "supersecret";

    const res = await authService.login(email, password);

    expect(apiPostMock).toHaveBeenCalledTimes(1);

    const [url, payload] = apiPostMock.mock.calls[0];

    expect(url.endsWith("/auth/sign-in")).toBe(true);
    expect(payload).toHaveProperty("current_password", password);
    expect(payload).not.toHaveProperty("password");

    expect(res).toEqual(mockResponse);
  });

  it("propagates errors from axios and wraps them in a readable object", async () => {
    const { apiPost } = await import("../infrastructure/http/apiPost");
    const apiPostMock = vi.mocked(apiPost);
    const errorResponse = { message: "invalid credentials" };

    apiPostMock.mockRejectedValueOnce(errorResponse);

    await expect(authService.login("a@b.c", "x")).rejects.toEqual(
      errorResponse,
    );
  });
});
