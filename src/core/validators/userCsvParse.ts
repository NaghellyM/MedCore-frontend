import Papa, { type ParseResult } from "papaparse";
import * as Yup from "yup";
import { userCsvSchema } from "./userCsvSchema";
import { type ImportError } from "../types/userCsvTypes";

export type UserCsv = Yup.InferType<typeof userCsvSchema>;

type CsvRow = Record<string, string>;

/**
 * Parsea y valida un archivo CSV de usuarios.
 * @param file Archivo CSV cargado por el usuario
 * @returns Promesa con usuarios válidos y errores por fila
 */
export async function importUsersFromCsv(
  file: File
): Promise<{ data: UserCsv[]; errors: ImportError[] }> {
  return new Promise((resolve, reject) => {
    Papa.parse<CsvRow>(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results: ParseResult<CsvRow>) => {
        const validUsers: UserCsv[] = [];
        const errors: ImportError[] = [];

        for (let i = 0; i < results.data.length; i++) {
          const row = results.data[i];
          try {
            const validUser = await userCsvSchema.validate(row, {
              abortEarly: false,
            });
            validUsers.push(validUser as UserCsv);
          } catch (err) {
            if (err instanceof Yup.ValidationError) {
              errors.push({
                row: i + 2,
                errors: err.errors,
                data: row,
              });
            } else {
              errors.push({
                row: i + 2,
                errors: ["Error desconocido validando la fila"],
                data: row,
              });
            }
          }
        }
        resolve({ data: validUsers, errors });
      },
      error: (err) => reject({ message: "Error al leer el CSV", error: err }),
    });
  });
}
