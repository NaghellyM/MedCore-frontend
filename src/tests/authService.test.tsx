import { describe, it, expect, vi } from "vitest";
import * as authService from "../services/authService";
import axios from "axios";

vi.mock("axios");

/**
 * Security tests for authService to ensure safe handling of credentials and error propagation.
 * These tests verify that passwords are sent securely in the request body and not in the URL,
 * and that errors from axios are properly propagated and wrapped in a readable format.
 */
describe("Security tests for authService", () => {
  it('sends credentials using "current_password" in the request body and does not leak password in URL', async () => {
    const postMock = vi.mocked(axios.post);
    const mockResponse = {
      data: { message: "ok", accessToken: "acctoken", refreshToken: "rftoken" },
    };
    postMock.mockResolvedValueOnce(mockResponse);

    const email = "user@example.com";
    const password = "supersecret";

    const res = await authService.login(email, password);

    expect(postMock).toHaveBeenCalledTimes(1);

    const [url, payload] = postMock.mock.calls[0];

    expect(url.endsWith("/auth/sign-in")).toBe(true);
    expect(payload).toHaveProperty("current_password", password);
    expect(payload).not.toHaveProperty("password");

    expect(res).toEqual(mockResponse.data);
  });

  it("propagates errors from axios and wraps them in a readable object", async () => {
    const postMock = vi.mocked(axios.post);
    const axiosErr = { response: { data: { message: "invalid credentials" } } };
    postMock.mockRejectedValueOnce(axiosErr);

    await expect(authService.login("a@b.c", "x")).rejects.toEqual(
      axiosErr.response.data,
    );
  });
});
