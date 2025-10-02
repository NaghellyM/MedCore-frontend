export interface RegisterUserDto {
    email: string
    fullname: string
    role: string
    current_password: string
    status?: string
    specialization?: string
    department?: string
    license_number?: string
    phone?: string
    date_of_birth?: string
}