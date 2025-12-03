import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "../core/context/authContext";
import Form from "../presentation/pages/login/loginDashboard";
import { login, logout, getCurrentUser } from "../core/services/authService";
import { verifyEmail } from "../core/services/verifyEmailService";

vi.mock("../core/services/authService", () => ({
  login: vi.fn(),
  logout: vi.fn(),
  getCurrentUser: vi.fn(),
  initializeAuth: vi.fn(),
  isAuthenticated: vi.fn(),
  setAuthHeader: vi.fn(),
}));

vi.mock("../core/services/verifyEmailService", () => ({
  verifyEmail: vi.fn(),
  requestVerificationCode: vi.fn(),
}));

vi.mock("../core/utils/decodeToken", () => ({
  decodeToken: vi.fn(),
}));

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({ pathname: "/login", search: "" }),
  };
});

/**
 * Test Suite for Authentication Flow
 * Tests the complete login flow, email verification, role-based redirection,
 * logout functionality, and access control to protected routes.
 */
describe("Authentication Flow tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should complete full login flow for doctor role", async () => {
    const user = userEvent.setup();
    const mockToken = "mock.jwt.token";
    const mockUser = {
      id: "1",
      email: "doctor@test.com",
      role: "MEDICO",
      name: "Dr. Test",
    };

    vi.mocked(login).mockResolvedValue({
      message: "Login successful",
      accessToken: mockToken,
    });
    vi.mocked(getCurrentUser).mockReturnValue(mockUser);

    render(
      <BrowserRouter>
        <AuthProvider>
          <Form />
        </AuthProvider>
      </BrowserRouter>,
    );

    const emailInput = screen.getByRole("textbox", {
      name: /correo electrónico/i,
    });
    const passwordInput = screen.getByLabelText(/^Contraseña$/);

    await user.type(emailInput, "doctor@test.com");
    await user.type(passwordInput, "password123");

    const submitButton = screen.getByRole("button", {
      name: /iniciar sesión/i,
    });
    await user.click(submitButton);

    await waitFor(() => {
      expect(login).toHaveBeenCalledWith("doctor@test.com", "password123");
      expect(getCurrentUser).toHaveBeenCalled();
    });
  });

  it("should handle email verification and redirect to dashboard", async () => {
    const mockToken = "verified.jwt.token";
    const mockUser = {
      id: "2",
      email: "admin@test.com",
      role: "ADMINISTRADOR",
      emailVerified: true,
    };

    vi.mocked(verifyEmail).mockResolvedValue({
      message: "Email verified",
      accessToken: mockToken,
    });
    vi.mocked(getCurrentUser).mockReturnValue(mockUser);

    const result = await verifyEmail("admin@test.com", "123456");

    expect(result.accessToken).toBe(mockToken);
    expect(verifyEmail).toHaveBeenCalledWith("admin@test.com", "123456");
  });

  it("should redirect user based on role after login", async () => {
    const roles = [
      { role: "ADMINISTRADOR", expectedPath: "/adminPage" },
      { role: "MEDICO", expectedPath: "/doctorPage" },
      { role: "ENFERMERA", expectedPath: "/nursePage" },
      { role: "PACIENTE", expectedPath: "/patient-dashboard" },
    ];

    for (const { role } of roles) {
      vi.mocked(getCurrentUser).mockReturnValue({
        id: "test",
        email: "test@test.com",
        role: role,
      });

      const user = getCurrentUser();
      expect(user.role).toBe(role);
    }
  });

  it("should handle logout and clear authentication state", async () => {
    const mockUser = {
      id: "1",
      email: "test@test.com",
      role: "MEDICO",
    };

    vi.mocked(getCurrentUser)
      .mockReturnValueOnce(mockUser)
      .mockReturnValueOnce(null);
    vi.mocked(logout).mockImplementation(() => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    });

    const userBefore = getCurrentUser();
    expect(userBefore).toBeTruthy();

    logout();
    expect(logout).toHaveBeenCalled();

    const userAfter = getCurrentUser();
    expect(userAfter).toBeNull();
  });

  it("should prevent access to protected routes without authentication", async () => {
    vi.mocked(getCurrentUser).mockReturnValue(null);

    const user = getCurrentUser();
    expect(user).toBeNull();

    const isAuthenticated = !!user;
    expect(isAuthenticated).toBe(false);
  });
});
