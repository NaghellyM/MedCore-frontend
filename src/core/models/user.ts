export interface RegisterUserDto {
    email: string
    fullname: string
    role: string
    current_password: string
    status?: string
    specialization?: string
    departamento?: string
    license_number?: string
    phone?: string
    identificacion: string
    date_of_birth: string
}