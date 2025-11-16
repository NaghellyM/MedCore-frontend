import { describe, it, expect, beforeEach, afterEach } from "vitest";

const STORAGE_KEY = "encounters";

type Encounter = {
  id: string;
  patientName: string;
  document: string;
  type: "teleconsulta" | "consulta-presencial" | string;
  doctor: string;
  dateTime?: string;
  createdAt?: string;
  updatedAt?: string;
};

/**
 * Tests for managing encounters in localStorage:
 * - Creating new encounters
 * - Updating existing encounters
 * - Listing encounters with sorting and filtering
 * - Deleting encounters
 */
describe("Encounter Management tests", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("should create new encounter and store in localStorage", () => {
    const newEncounter: Encounter = {
      id: crypto.randomUUID(),
      patientName: "Juan Pérez",
      document: "1234567890",
      type: "consulta-presencial",
      doctor: "Dr. María García",
      dateTime: "2025-11-08T10:00:00",
      createdAt: new Date().toISOString(),
    };

    const list = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    list.push(newEncounter);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));

    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    expect(stored).toHaveLength(1);
    expect(stored[0].patientName).toBe("Juan Pérez");
    expect(stored[0].type).toBe("consulta-presencial");
  });

  it("should update existing encounter", () => {
    const encounterId = "enc-001";
    const initialEncounter: Encounter = {
      id: encounterId,
      patientName: "María González",
      document: "9876543210",
      type: "teleconsulta",
      doctor: "Dr. Carlos Rodríguez",
      dateTime: "2025-11-08T14:00:00",
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify([initialEncounter]));

    const list = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    const index = list.findIndex((e: Encounter) => e.id === encounterId);
    if (index !== -1) {
      list[index] = {
        ...list[index],
        type: "consulta-presencial",
        dateTime: "2025-11-09T10:00:00",
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    }

    const updated = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    expect(updated[0].type).toBe("consulta-presencial");
    expect(updated[0].dateTime).toBe("2025-11-09T10:00:00");
    expect(updated[0].updatedAt).toBeDefined();
  });

  it("should list all encounters sorted by date", () => {
    const encounters: Encounter[] = [
      {
        id: "1",
        patientName: "Paciente 1",
        document: "1111111111",
        type: "consulta-presencial",
        doctor: "Dr. Test",
        dateTime: "2025-11-08T10:00:00",
        createdAt: "2025-11-08T09:00:00",
      },
      {
        id: "2",
        patientName: "Paciente 2",
        document: "2222222222",
        type: "teleconsulta",
        doctor: "Dr. Test",
        dateTime: "2025-11-07T15:00:00",
        createdAt: "2025-11-07T14:00:00",
      },
      {
        id: "3",
        patientName: "Paciente 3",
        document: "3333333333",
        type: "consulta-presencial",
        doctor: "Dr. Test",
        dateTime: "2025-11-09T08:00:00",
        createdAt: "2025-11-09T07:00:00",
      },
    ];

    localStorage.setItem(STORAGE_KEY, JSON.stringify(encounters));

    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    const sorted = stored.sort(
      (a: Encounter, b: Encounter) =>
        new Date(b.dateTime || "").getTime() -
        new Date(a.dateTime || "").getTime(),
    );

    expect(sorted).toHaveLength(3);
    expect(sorted[0].id).toBe("3");
    expect(sorted[2].id).toBe("2");
  });

  it("should filter encounters by type", () => {
    const encounters: Encounter[] = [
      {
        id: "1",
        patientName: "Paciente 1",
        document: "1111111111",
        type: "teleconsulta",
        doctor: "Dr. Test",
      },
      {
        id: "2",
        patientName: "Paciente 2",
        document: "2222222222",
        type: "consulta-presencial",
        doctor: "Dr. Test",
      },
      {
        id: "3",
        patientName: "Paciente 3",
        document: "3333333333",
        type: "teleconsulta",
        doctor: "Dr. Test",
      },
    ];

    localStorage.setItem(STORAGE_KEY, JSON.stringify(encounters));

    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    const teleconsultas = stored.filter(
      (e: Encounter) => e.type === "teleconsulta",
    );
    const presenciales = stored.filter(
      (e: Encounter) => e.type === "consulta-presencial",
    );

    expect(teleconsultas).toHaveLength(2);
    expect(presenciales).toHaveLength(1);
  });

  it("should delete encounter by id", () => {
    const encounters: Encounter[] = [
      {
        id: "del-1",
        patientName: "To Delete",
        document: "1111111111",
        type: "teleconsulta",
        doctor: "Dr. Test",
      },
      {
        id: "keep-1",
        patientName: "To Keep",
        document: "2222222222",
        type: "consulta-presencial",
        doctor: "Dr. Test",
      },
    ];

    localStorage.setItem(STORAGE_KEY, JSON.stringify(encounters));

    const list = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    const filtered = list.filter((e: Encounter) => e.id !== "del-1");
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));

    const remaining = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    expect(remaining).toHaveLength(1);
    expect(remaining[0].id).toBe("keep-1");
  });
});
