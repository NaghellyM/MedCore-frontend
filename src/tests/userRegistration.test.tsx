import { describe, it, expect, vi, beforeEach } from "vitest";
import { registerUser } from "../core/services/patientService";
import { uploadUsersCsv } from "../core/services/userImportService";
import type { RegisterUserDto } from "../core/models/user";

vi.mock("../infrastructure/http/http", () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
  },
}));

import http from "../infrastructure/http/http";

/**
 * Test Suite for User Registration
 * Tests individual user registration for different roles (doctor, nurse, patient),
 * bulk user upload via CSV, validation of required fields, and handling of duplicate users.
 */
describe("User Registration tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should register a new doctor with all required fields", async () => {
    const newDoctor: RegisterUserDto = {
      email: "doctor@test.com",
      fullname: "Dr. Juan Perez",
      role: "MEDICO",
      current_password: "SecurePass123!",
      status: "ACTIVE",
      specialization: "1",
      departamento: "Cardiología",
      license_number: "LIC123456",
      phone: "3001234567",
      identificacion: "1234567890",
      date_of_birth: "1985-05-15",
    };

    const mockResponse = {
      data: {
        message: "Usuario registrado exitosamente",
        user: { id: "1", ...newDoctor },
      },
    };

    vi.mocked(http.post).mockResolvedValue(mockResponse);

    const result = await registerUser(newDoctor);

    expect(http.post).toHaveBeenCalledWith(
      expect.stringContaining("/auth/sign-up"),
      newDoctor,
    );
    expect(result.message).toBe("Usuario registrado exitosamente");
    expect(result.user.email).toBe(newDoctor.email);
  });

  it("should register a nurse with correct role and fields", async () => {
    const newNurse: RegisterUserDto = {
      email: "nurse@test.com",
      fullname: "María García",
      role: "ENFERMERA",
      current_password: "NursePass123!",
      status: "ACTIVE",
      phone: "3007654321",
      identificacion: "9876543210",
      date_of_birth: "1990-08-20",
    };

    const mockResponse = {
      data: {
        message: "Usuario registrado exitosamente",
        user: { id: "2", ...newNurse },
      },
    };

    vi.mocked(http.post).mockResolvedValue(mockResponse);

    const result = await registerUser(newNurse);

    expect(result.user.role).toBe("ENFERMERA");
    expect(result.user.fullname).toBe("María García");
  });

  it("should handle bulk user upload via CSV", async () => {
    const csvContent = `email,fullname,role,current_password,identificacion
doctor1@test.com,Dr. Test One,MEDICO,Pass123!,1111111111
nurse1@test.com,Nurse Test One,ENFERMERA,Pass456!,2222222222
patient1@test.com,Patient Test One,PACIENTE,Pass789!,3333333333`;

    const file = new File([csvContent], "users.csv", { type: "text/csv" });

    const mockResponse = {
      data: {
        message: "Usuarios importados exitosamente",
        imported: 3,
        failed: 0,
        details: [],
      },
    };

    vi.mocked(http.post).mockResolvedValue(mockResponse);

    const result = await uploadUsersCsv(file);

    expect(http.post).toHaveBeenCalledWith(
      expect.stringContaining("/admin/bulk-upload"),
      expect.any(FormData),
      expect.objectContaining({
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }),
    );
    expect(result.imported).toBe(3);
    expect(result.failed).toBe(0);
  });

  it("should validate required fields before registration", async () => {
    const incompleteUser = {
      email: "incomplete@test.com",
      fullname: "Incomplete User",
      role: "MEDICO",
    } as RegisterUserDto;

    vi.mocked(http.post).mockRejectedValue({
      response: {
        data: {
          message: "Campos requeridos faltantes",
          errors: [
            "current_password es requerido",
            "identificacion es requerida",
          ],
        },
      },
    });

    await expect(registerUser(incompleteUser)).rejects.toMatchObject({
      response: {
        data: {
          message: expect.stringContaining("Campos requeridos"),
        },
      },
    });
  });

  it("should prevent duplicate user registration", async () => {
    const existingUser: RegisterUserDto = {
      email: "existing@test.com",
      fullname: "Existing User",
      role: "PACIENTE",
      current_password: "Pass123!",
      identificacion: "1234567890",
    };

    vi.mocked(http.post).mockRejectedValue({
      response: {
        data: {
          message: "El usuario ya existe",
          code: "USER_ALREADY_EXISTS",
        },
      },
    });

    await expect(registerUser(existingUser)).rejects.toMatchObject({
      response: {
        data: {
          message: "El usuario ya existe",
        },
      },
    });

    expect(http.post).toHaveBeenCalledTimes(1);
  });
});
