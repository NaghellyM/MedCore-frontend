import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { screen, render, waitFor, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { login as mockedLogin } from "../core/services/authService";
import Form from "../presentation/pages/login/loginDashboard";
import { AuthProvider } from "../core/context/authContext";

vi.mock("../core/services/authService", () => ({
  login: vi.fn(),
  initializeAuth: vi.fn(),
  getCurrentUser: vi.fn(),
  logout: vi.fn(),
  setAuthHeader: vi.fn(),
}));

vi.mock("../core/utils/decodeToken", () => ({
  decodeToken: vi.fn(),
}));

const mockedNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockedNavigate,
  };
});

/**
 * Tests for role-based access and session safety in a React application.
 * These tests ensure that users are redirected to the correct dashboard based on their role
 * and that sensitive information is not stored in localStorage.
 */
describe("Role-based access and session safety tests", () => {
  beforeEach(async () => {
    const localStorageMock = (() => {
      let store: Record<string, string> = {};
      return {
        getItem: (key: string) => (key in store ? store[key] : null),
        setItem: (key: string, value: string) => {
          store[key] = String(value);
        },
        removeItem: (key: string) => {
          delete store[key];
        },
        clear: () => {
          store = {};
        },
      };
    })();
    Object.defineProperty(global, "localStorage", {
      value: localStorageMock,
      writable: true,
    });

    vi.resetAllMocks();
    cleanup();
    vi.stubGlobal("alert", vi.fn());

    const { initializeAuth, getCurrentUser, logout, setAuthHeader } =
      await import("../core/services/authService");
    vi.mocked(initializeAuth).mockImplementation(() => {});
    vi.mocked(getCurrentUser).mockReturnValue(null);
    vi.mocked(logout).mockImplementation(() => {});
    vi.mocked(setAuthHeader).mockImplementation(() => {});
  });

  afterEach(() => {
    cleanup();
  });

  /**
   * Test case: Verify that an ADMINISTRADOR user is redirected to the correct dashboard
   * and that only tokens are stored in localStorage, not the password.
   */
  it("stores only tokens and redirects by role ADMINISTRADOR -> /adminPage", async () => {
    const { decodeToken } = await import("../core/utils/decodeToken");
    vi.mocked(decodeToken).mockImplementationOnce(() => ({
      sub: "admin-id",
      fullname: "Admin User",
      email: "admin@example.com",
      exp: Date.now() / 1000 + 3600,
      iat: Date.now() / 1000,
      role: "ADMINISTRADOR",
    }));

    vi.mocked(mockedLogin).mockImplementationOnce(async () => {
      const response = {
        message: "ok",
        accessToken: "atoken",
        refreshToken: "rtoken",
      };
      localStorage.setItem("accessToken", response.accessToken);
      localStorage.setItem("refreshToken", response.refreshToken);
      return response;
    });

    render(
      <AuthProvider>
        <Form />
      </AuthProvider>,
    );
    const user = userEvent.setup();

    const emailInput = screen.getByLabelText(/Correo Electrónico/i);
    const passInput = screen.getByLabelText(/Contraseña/i);
    const submit = screen.getByRole("button", {
      name: /Iniciar sesión|Entrar|Login|Acceder/i,
    });

    await user.type(emailInput, "admin@example.com");
    await user.type(passInput, "topsecret1");
    await user.click(submit);

    await waitFor(() => {
      expect(localStorage.getItem("accessToken")).toBe("atoken");
      expect(localStorage.getItem("refreshToken")).toBe("rtoken");
    });

    expect(localStorage.getItem("password")).toBeNull();
    await waitFor(() =>
      expect(mockedNavigate).toHaveBeenCalledWith("/adminPage"),
    );
  });

  /**
   * Test case: Verify that PACIENTE and MEDICO users are redirected to their respective dashboards.
   */
  it("redirects PACIENTE -> /patientPage and MEDICO -> /doctorPage", async () => {
    const { decodeToken } = await import("../core/utils/decodeToken");

    vi.mocked(decodeToken).mockImplementationOnce(() => ({
      sub: "admin-id",
      fullname: "Paciente Uno",
      email: "admin@example.com",
      exp: Date.now() / 1000 + 3600,
      iat: Date.now() / 1000,
      role: "PACIENTE",
    }));

    vi.mocked(mockedLogin).mockImplementationOnce(async () => {
      const response = {
        message: "ok",
        accessToken: "ptoken",
        refreshToken: "prtoken",
      };
      localStorage.setItem("accessToken", response.accessToken);
      localStorage.setItem("refreshToken", response.refreshToken);
      return response;
    });

    render(
      <AuthProvider>
        <Form />
      </AuthProvider>,
    );

    const emailInput = screen.getByLabelText(/Correo Electrónico/i);
    const passInput = screen.getByLabelText(/Contraseña/i);
    const submit = screen.getByRole("button", {
      name: /Iniciar sesión|Entrar|Login|Acceder/i,
    });

    const user = userEvent.setup();
    await user.type(emailInput, "p@example.com");
    await user.type(passInput, "paciente123");
    await user.click(submit);

    await waitFor(() =>
      expect(mockedNavigate).toHaveBeenCalledWith("/patientPage"),
    );

    cleanup();
    vi.resetAllMocks();
    mockedNavigate.mockClear();

    vi.mocked(decodeToken).mockImplementationOnce(() => ({
      sub: "admin-id",
      fullname: "Doctor Who",
      email: "admin@example.com",
      exp: Date.now() / 1000 + 3600,
      iat: Date.now() / 1000,
      role: "MEDICO",
    }));
    vi.mocked(mockedLogin).mockImplementationOnce(async () => {
      const response = {
        message: "ok",
        accessToken: "dtoken",
        refreshToken: "drtoken",
      };
      localStorage.setItem("accessToken", response.accessToken);
      localStorage.setItem("refreshToken", response.refreshToken);
      return response;
    });

    render(
      <AuthProvider>
        <Form />
      </AuthProvider>,
    );

    const email2 = screen.getByLabelText(/Correo Electrónico/i);
    const pass2 = screen.getByLabelText(/Contraseña/i);
    const submit2 = screen.getByRole("button", {
      name: /Iniciar sesión|Entrar|Login|Acceder/i,
    });

    await user.type(email2, "d@example.com");
    await user.type(pass2, "doctor123");
    await user.click(submit2);

    await waitFor(() => {
      expect(mockedNavigate).toHaveBeenCalledWith("/doctorPage");
    });
  });
});
