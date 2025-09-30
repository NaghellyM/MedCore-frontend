import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { screen, render, waitFor, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { login as mockedLogin } from "../services/authService";
import Form from "../pages/loginPage";

vi.mock("../services/authService", () => ({
  login: vi.fn(),
}));

vi.mock("../utils/decodeToken", () => ({
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
describe("Role-based access and session safety tests (advanced)", () => {
  beforeEach(() => {
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
  });

  afterEach(() => {
    cleanup();
  });

  /**
   * Test case: Verify that an ADMINISTRADOR user is redirected to the correct dashboard
   * and that only tokens are stored in localStorage, not the password.
   */
  it("stores only tokens and redirects by role ADMINISTRADOR -> /dashboard/administrador", async () => {
    const { decodeToken } = await import("../utils/decodeToken");
    vi.mocked(decodeToken).mockImplementationOnce(() => ({
      role: "ADMINISTRADOR",
    }));

    vi.mocked(mockedLogin).mockResolvedValueOnce({
      message: "ok",
      accessToken: "atoken",
      refreshToken: "rtoken",
    });

    render(<Form />);
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
      expect(mockedNavigate).toHaveBeenCalledWith("/dashboard/administrador"),
    );
  });

  /**
   * Test case: Verify that PACIENTE and MEDICO users are redirected to their respective dashboards.
   */
  it("redirects PACIENTE -> /dashboard/paciente and MEDICO -> /doctorPage", async () => {
    const { decodeToken } = await import("../utils/decodeToken");

    vi.mocked(decodeToken).mockImplementationOnce(() => ({
      role: "PACIENTE",
    }));

    vi.mocked(mockedLogin).mockResolvedValueOnce({
      message: "ok",
      accessToken: "ptoken",
      refreshToken: "prtoken",
    });

    render(<Form />);

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
      expect(mockedNavigate).toHaveBeenCalledWith("/dashboard/paciente"),
    );

    cleanup();
    vi.resetAllMocks();
    mockedNavigate.mockClear();

    vi.mocked(decodeToken).mockImplementationOnce(() => ({
      role: "MEDICO",
    }));
    vi.mocked(mockedLogin).mockResolvedValueOnce({
      message: "ok",
      accessToken: "dtoken",
      refreshToken: "drtoken",
    });

    render(<Form />);

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
