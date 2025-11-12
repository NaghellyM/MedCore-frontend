import { describe, it, expect, vi, beforeEach } from "vitest";
import { doctorsService } from "../core/services/doctorsService";
import { nursesService } from "../core/services/nursesService";

vi.mock("../infrastructure/http/http", () => ({
  default: {
    get: vi.fn(),
    put: vi.fn(),
    post: vi.fn(),
  },
}));

import http from "../infrastructure/http/http";

describe("Doctors and Nurses Services tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch all doctors with pagination", async () => {
    const mockDoctors = {
      users: [
        {
          id: "doc-1",
          fullname: "Dr. Juan Pérez",
          identificacion: "1234567890",
          especializacion: {
            id: "1",
            nombre: "Cardiología",
            departamento: { nombre: "Medicina Interna" },
          },
          status: "ACTIVE",
        },
        {
          id: "doc-2",
          fullname: "Dra. María García",
          identificacion: "9876543210",
          especializacion: {
            id: "2",
            nombre: "Pediatría",
            departamento: { nombre: "Pediatría" },
          },
          status: "ACTIVE",
        },
      ],
      totalPages: 1,
      currentPage: 1,
    };

    vi.mocked(http.get).mockResolvedValue({ data: mockDoctors });

    const result = await doctorsService.getAll(1, 10);

    expect(http.get).toHaveBeenCalledWith(
      expect.stringContaining("/users/by-role-status?role=medico"),
    );
    expect(result.users).toHaveLength(2);
    expect(result.users[0].fullname).toBe("Dr. Juan Pérez");
  });

  it("should search doctors by name or identification", async () => {
    const searchQuery = "Juan";
    const mockSearchResult = {
      users: [
        {
          id: "doc-1",
          fullname: "Dr. Juan Pérez",
          identificacion: "1234567890",
          especializacion: {
            id: "1",
            nombre: "Cardiología",
          },
          status: "ACTIVE",
        },
      ],
      totalPages: 1,
      currentPage: 1,
    };

    vi.mocked(http.get).mockResolvedValue({ data: mockSearchResult });

    const result = await doctorsService.searchByNameOrId(searchQuery, 1, 10);

    expect(http.get).toHaveBeenCalled();
    expect(result.users).toHaveLength(1);
    expect(result.users[0].fullname).toContain("Juan");
  });

  it("should fetch all nurses and filter by status", async () => {
    const mockNurses = {
      users: [
        {
          id: "nur-1",
          fullname: "Enfermera Ana López",
          identificacion: "1111111111",
          role: "ENFERMERA",
          status: "ACTIVE",
        },
        {
          id: "nur-2",
          fullname: "Enfermero Carlos Martínez",
          identificacion: "2222222222",
          role: "ENFERMERA",
          status: "INACTIVE",
        },
        {
          id: "nur-3",
          fullname: "Enfermera Laura Torres",
          identificacion: "3333333333",
          role: "ENFERMERA",
          status: "ACTIVE",
        },
      ],
    };

    vi.mocked(http.get).mockResolvedValue({ data: mockNurses });

    const allNurses = await nursesService.getAll();
    expect(allNurses.users).toHaveLength(3);

    const activeNurses = allNurses.users.filter(
      (nurse: { status: string }) => nurse.status === "ACTIVE",
    );
    expect(activeNurses).toHaveLength(2);
  });

  it("should update doctor status from active to inactive", async () => {
    const doctorId = "doc-1";
    const updatePayload = {
      status: "INACTIVE",
    };

    const mockResponse = {
      data: {
        message: "Estado actualizado exitosamente",
        user: {
          id: doctorId,
          status: "INACTIVE",
        },
      },
    };

    vi.mocked(http.put).mockResolvedValue(mockResponse);

    const result = await http.put(`/users/${doctorId}/status`, updatePayload);

    expect(http.put).toHaveBeenCalledWith(
      `/users/${doctorId}/status`,
      updatePayload,
    );
    expect(result.data.user.status).toBe("INACTIVE");
  });

  it("should handle specialty filtering for doctors", async () => {
    const mockDoctorsBySpecialty = {
      users: [
        {
          id: "doc-1",
          fullname: "Dr. Cardiólogo 1",
          especializacion: { id: "1", nombre: "Cardiología" },
          status: "ACTIVE",
        },
        {
          id: "doc-2",
          fullname: "Dr. Cardiólogo 2",
          especializacion: { id: "1", nombre: "Cardiología" },
          status: "ACTIVE",
        },
      ],
      totalPages: 1,
      currentPage: 1,
    };

    vi.mocked(http.get).mockResolvedValue({ data: mockDoctorsBySpecialty });

    const result = await doctorsService.getAll();

    const cardiologists = result.users.filter(
      (doc: { especializacion: { nombre: string } }) =>
        doc.especializacion.nombre === "Cardiología",
    );

    expect(cardiologists).toHaveLength(2);
    expect(cardiologists[0].especializacion.nombre).toBe("Cardiología");
  });
});
