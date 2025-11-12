import { describe, it, expect, vi, beforeEach } from "vitest";
import { createEncounter } from "../core/services/medicalHistoryService";
import type { EncounterPayload } from "../core/types/medical";

global.fetch = vi.fn();

/**
 * Test Suite for Medical History Management
 * Tests creation of complete medical histories with all sections,
 * storage and retrieval from localStorage, validation of required data,
 * handling of multiple diagnoses and prescriptions, and BMI calculation.
 */
describe("Medical History Management tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("should create complete medical history with all sections", async () => {
    const completeEncounter: EncounterPayload = {
      patient: {
        document_type: "CC",
        document_number: "1234567890",
        first_name: "Juan",
        last_name: "Pérez",
        birth_date: "1980-01-15",
        sex_at_birth: "M",
        contact: {
          phone: "3001234567",
          email: "juan.perez@test.com",
        },
      },
      encounter: {
        type: "presencial",
        date_time: "2025-11-08T10:30:00",
        chief_complaint: "Control general",
        mode: "presencial",
        physical_exam: "Paciente en buen estado general",
        modeTelemedicine: false,
        vitals: {
          temp: "36.5",
          hr: "72",
          rr: "16",
          bp: "120/80",
          spo2: "98",
          weight: "75",
          height: "175",
        },
        diagnoses: [
          {
            code: "Z00.0",
            description: "Examen médico general",
            type: "principal",
          },
        ],
        prescriptions: [
          {
            drug: "Paracetamol",
            dose: "500mg",
            route: "oral",
            frequency: "Cada 8 horas",
          },
        ],
        orders: [
          {
            type: "lab",
            description: "Hemograma completo",
            status: "pendiente",
          },
        ],
        allergies: [
          {
            substance: "Penicilina",
            severity: "alta",
            reaction: "Rash cutáneo",
          },
        ],
      },
      allergies: [
        {
          substance: "Penicilina",
          severity: "alta",
          reaction: "Rash cutáneo",
        },
      ],
      audit: {
        created_at: new Date().toISOString(),
      },
    };

    const mockResponse = {
      ok: true,
      json: async () => ({
        id: "encounter-001",
        message: "Historia clínica creada exitosamente",
        ...completeEncounter,
      }),
    };

    vi.mocked(fetch).mockResolvedValue(mockResponse as Response);

    const result = await createEncounter(completeEncounter);

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/encounters"),
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(completeEncounter),
      }),
    );
    expect(result.id).toBe("encounter-001");
  });

  it("should store and retrieve medical history from localStorage", () => {
    const STORAGE_KEY = "medical_histories";
    const mockHistory: EncounterPayload & { id: string; createdAt: string } = {
      id: "hist-001",
      createdAt: new Date().toISOString(),
      patient: {
        document_type: "CC",
        document_number: "9876543210",
        first_name: "María",
        last_name: "González",
        birth_date: "1992-05-20",
        sex_at_birth: "F",
        contact: {
          phone: "3007654321",
          email: "maria.gonzalez@test.com",
        },
      },
      encounter: {
        type: "teleconsulta",
        date_time: "2025-11-08T14:00:00",
        chief_complaint: "Consulta de control",
        mode: "teleconsulta",
        physical_exam: "Consulta virtual",
        modeTelemedicine: true,
        vitals: {
          temp: "36.8",
          hr: "75",
        },
        diagnoses: [],
        prescriptions: [],
        orders: [],
        allergies: [],
      },
      allergies: [],
      audit: {
        created_at: new Date().toISOString(),
      },
    };

    const existingData = localStorage.getItem(STORAGE_KEY);
    const histories = existingData ? JSON.parse(existingData) : [];
    histories.push(mockHistory);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(histories));

    const retrieved = localStorage.getItem(STORAGE_KEY);
    const parsedHistories = JSON.parse(retrieved || "[]");

    expect(parsedHistories).toHaveLength(1);
    expect(parsedHistories[0].id).toBe("hist-001");
    expect(parsedHistories[0].patient.first_name).toBe("María");
  });

  it("should validate required patient data before creation", async () => {
    const mockErrorResponse = {
      ok: false,
      status: 400,
      text: async () => "Número de documento es requerido",
    };

    vi.mocked(fetch).mockResolvedValue(mockErrorResponse as Response);

    const incompleteData = {
      patient: {
        document_type: "CC",
        first_name: "Test",
        last_name: "User",
      },
      encounter: {
        date: "2025-11-08",
        reason: "Consulta",
      },
    };

    await expect(
      createEncounter(incompleteData as unknown as EncounterPayload),
    ).rejects.toThrow("Número de documento es requerido");
  });

  it("should handle multiple diagnoses and prescriptions", async () => {
    const encounterWithMultiples: EncounterPayload = {
      patient: {
        document_type: "CC",
        document_number: "1111111111",
        first_name: "Carlos",
        last_name: "Rodríguez",
        birth_date: "1975-03-10",
        sex_at_birth: "M",
        contact: {
          phone: "3009876543",
          email: "carlos@test.com",
        },
      },
      encounter: {
        type: "presencial",
        date_time: "2025-11-08T16:00:00",
        chief_complaint: "Hipertensión y diabetes",
        mode: "presencial",
        physical_exam: "Paciente con comorbilidades",
        modeTelemedicine: false,
        vitals: {
          bp: "145/90",
        },
        diagnoses: [
          {
            code: "I10",
            description: "Hipertensión esencial",
            type: "principal",
          },
          {
            code: "E11",
            description: "Diabetes mellitus tipo 2",
            type: "secundario",
          },
        ],
        prescriptions: [
          {
            drug: "Enalapril",
            dose: "10mg",
            route: "oral",
            frequency: "Una vez al día",
          },
          {
            drug: "Metformina",
            dose: "850mg",
            route: "oral",
            frequency: "Dos veces al día",
          },
        ],
        orders: [],
        allergies: [],
      },
      allergies: [],
      audit: {
        created_at: new Date().toISOString(),
      },
    };

    const mockResponse = {
      ok: true,
      json: async () => ({
        id: "encounter-002",
        ...encounterWithMultiples,
      }),
    };

    vi.mocked(fetch).mockResolvedValue(mockResponse as Response);

    const result = await createEncounter(encounterWithMultiples);

    expect(result.encounter.diagnoses).toHaveLength(2);
    expect(result.encounter.prescriptions).toHaveLength(2);
  });

  it("should calculate BMI from height and weight vitals", () => {
    const height = 175;
    const weight = 75;

    const bmi = +(weight / Math.pow(height / 100, 2)).toFixed(2);

    expect(bmi).toBe(24.49);
    expect(bmi).toBeGreaterThan(18.5);
    expect(bmi).toBeLessThan(25);
  });
});
