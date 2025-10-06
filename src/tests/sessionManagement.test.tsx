import { describe, it, expect, beforeEach } from "vitest";
import http from "../infrastructure/http/http";

/**
 * Tests for session management via HTTP request interceptor.
 * These tests ensure that the Authorization header is correctly attached to outgoing requests
 * based on the presence of a token in localStorage, and that no sensitive information is leaked.
 */
describe("Session management", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("NOT attach Authorization header when token is stored", async () => {
    const handlers = (http.interceptors.request as any).handlers;

    expect(Array.isArray(handlers)).toBe(true);
    const handler = handlers.find(
      (h: any) => !!h && typeof h.fulfilled === "function",
    );
    expect(handler).toBeTruthy();

    const config = { headers: {} };
    const result = handler.fulfilled(config);

    expect(result.headers.Authorization).toBeUndefined();
  });

  it("attaches Authorization header when token is stored", async () => {
    localStorage.setItem("accessToken", "xyz987");

    const handlers = (http.interceptors.request as any).handlers;
    const handler = handlers.find(
      (h: any) => !!h && typeof h.fulfilled === "function",
    );
    const config = { headers: {} };
    const result = handler.fulfilled(config);

    expect(result.headers.Authorization).toBe("Bearer xyz987");
  });
});
