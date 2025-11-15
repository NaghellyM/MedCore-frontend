export interface UserCsv {
  nombre: string
  correo: string
  rol: "PACIENTE" | "MEDICO" | "ENFERMERA"
}

type CsvRow = Record<string, string>;

export interface ImportError {
  row: number; 
  errors: string[];
  data: CsvRow;
}