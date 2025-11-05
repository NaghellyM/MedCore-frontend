import Papa from "papaparse"
import { userCsvSchema } from "./userCsvSchema"
import * as Yup from "yup"

export async function validateUserCsvRow(row: any, index: number) {
  try {
    await userCsvSchema.validate(row, { abortEarly: false })
    return { valid: true, data: row }
  } catch (error) {
    if (error instanceof Yup.ValidationError) {
      return { valid: false, error: `Fila ${index + 2}: ${error.errors.join(", ")}` }
    }
    return { valid: false, error: `Fila ${index + 2}: Error desconocido` }
  }
}

export async function importUsersFromCsv(file: File) {
  return new Promise<{ validRows: any[]; errors: string[] }>((resolve) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const { data } = results
        const validRows: any[] = []
        const errors: string[] = []
        for (let i = 0; i < data.length; i++) {
          const result = await validateUserCsvRow(data[i], i)
          if (result.valid) {
            validRows.push(result.data)
          } else if (result.error) { 
            errors.push(result.error)
          }
        }
        resolve({ validRows, errors })
      },
    })
  })
}
