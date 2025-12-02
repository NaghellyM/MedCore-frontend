import { useEffect, useState } from "react";
import { doctorsService } from "../../../../core/services/doctorsService";
import DoctorCard from "../../doctor/components/DoctorCard";
import { Search, Stethoscope } from "lucide-react";
import Swal from "sweetalert2";
import { useToast } from "../../../../core/hooks/notifications";
import { DashboardLayout } from "../../../layouts/dashboardLayout";
import { AdminSidebar } from "../components/adminSidebar";

interface Especializacion {
    id: string;
    nombre: string;
    departamento?: { nombre: string };
}

interface DoctorApi {
    id: string;
    fullname: string;
    identificacion?: string;
    especializacion: Especializacion;
    status: string;
}

interface DoctorCardData {
    id: string;
    name: string;
    identification: string;
    specialty: string;
    status: "ACTIVE" | "INACTIVE" | "PENDING" | "UNKNOWN";
    active: boolean;
    avatar: string;
}

type DoctorStatus = "ACTIVE" | "INACTIVE" | "PENDING" | "UNKNOWN";

const normalizeStatus = (s?: string): DoctorStatus => {
    const v = (s || "UNKNOWN").toUpperCase();
    const allowed: DoctorStatus[] = ["ACTIVE", "INACTIVE", "PENDING", "UNKNOWN"];
    return allowed.includes(v as DoctorStatus) ? (v as DoctorStatus) : "UNKNOWN";
};

export default function DoctorsList() {
    const [doctors, setDoctors] = useState<DoctorCardData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [statusFilter, setStatusFilter] = useState<"active" | "inactive" | "pending" | "">("");
    const [specialties, setSpecialties] = useState<Especializacion[]>([]);
    const [selectedSpecialty, setSelectedSpecialty] = useState<string>("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const { error: showError } = useToast();

    // Debounce búsqueda
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchTerm);
            setCurrentPage(1);
            if (searchTerm.trim()) {
                setStatusFilter("");
                setSelectedSpecialty("");
            }
        }, 500);
        return () => clearTimeout(handler);
    }, [searchTerm]);

    // Cargar especialidades
    useEffect(() => {
        const loadSpecialties = async () => {
            try {
                const response = await doctorsService.getSpecialties();
                setSpecialties(response || []);
            } catch (error) {
                Swal.fire({
                    icon: "error",
                    title: "Error al cargar especialidades",
                    text: "No se pudieron cargar las especialidades médicas.",
                    toast: true,
                    position: "top-end",
                    showConfirmButton: false,
                    timer: 3000,
                });
            }
        };
        loadSpecialties();
    }, []);

    // Obtener doctores
    const fetchDoctors = async () => {
        try {
            setLoading(true);
            setError(null);
            let response: any;

            if (debouncedSearch.trim()) {
                response = await doctorsService.searchByNameOrId(debouncedSearch, currentPage, itemsPerPage);
            } else if (selectedSpecialty) {
                response = await doctorsService.filterBySpecialty(selectedSpecialty);
            } else if (statusFilter) {
                response = await doctorsService.filterByStatus(statusFilter, currentPage, itemsPerPage);
            } else {
                response = await doctorsService.getAll(currentPage, itemsPerPage);
            }

            let users: any[] = [];
            let total = 0;

            if (Array.isArray(response)) {
                users = response;
                total = users.length;
            } else if (response && typeof response === "object") {
                if (Array.isArray(response.data)) {
                    users = response.data;
                    total = response.total || response.data.length;
                } else {
                    const nestedArray = Object.values(response).find(Array.isArray);
                    if (nestedArray) users = nestedArray;
                    total = users.length;
                }
            }

            setTotalItems(total);
            setTotalPages(Math.ceil(total / itemsPerPage));

            const mappedDoctors: DoctorCardData[] = users.map((doc: DoctorApi) => ({
                id: doc.id,
                name: doc.fullname,
                identification: doc.identificacion || "N/A",
                specialty: doc.especializacion?.nombre || "Sin especialidad",
                status: normalizeStatus(doc.status),
                active: (doc.status ?? "").toUpperCase() === "ACTIVE",
                avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(doc.fullname)}&background=3b82f6&color=fff&size=128&bold=true`,
            }));

            setDoctors(mappedDoctors);
        } catch (err) {
            setError("No se pudieron cargar los doctores.");
            showError("Error al cargar doctores", "No se pudieron obtener los datos de los doctores.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDoctors();
    }, [statusFilter, selectedSpecialty, currentPage, debouncedSearch]);

    // Eliminar doctor
    const handleDeleteDoctor = async (id: string) => {
        Swal.fire({
            title: "¿Estás seguro?",
            text: "Esta acción eliminará permanentemente el doctor.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await doctorsService.deleteDoctor(id);
                    setDoctors((prev) => prev.filter((doc) => doc.id !== id));
                    Swal.fire("Eliminado", "El doctor fue eliminado correctamente.", "success");
                } catch (error) {
                    Swal.fire("Error", "No se pudo eliminar el doctor.", "error");
                }
            }
        });
    };

    const handleStatusChange = (status: "active" | "inactive" | "pending" | "") => {
        setStatusFilter(status);
        setSelectedSpecialty("");
        setSearchTerm("");
        setCurrentPage(1);
    };

    const handleSpecialtyChange = (value: string) => {
        setSelectedSpecialty(value);
        setStatusFilter("");
        setSearchTerm("");
        setCurrentPage(1);
    };

    const handlePageChange = (newPage: number) => {
        if (newPage < 1 || newPage > totalPages) return;
        setCurrentPage(newPage);
    };

    // Configuración de botones de filtro
    const filterButtons = [
        { label: "Todos", value: "", activeClass: "bg-primary text-primary-foreground" },
        { label: "Activos", value: "active", activeClass: "bg-success text-success-foreground" },
        { label: "Inactivos", value: "inactive", activeClass: "bg-destructive text-destructive-foreground" },
        { label: "Pendientes", value: "pending", activeClass: "bg-warning text-warning-foreground" },
    ];

    return (
        <DashboardLayout sidebar={<AdminSidebar />} showSearch={false}>
            <div className="p-6 space-y-6">
                {/* Título */}
                <div className="flex items-center gap-3 mb-4">
                    <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
                        <Stethoscope className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">
                            Listado de Doctores
                            <span className="text-sm font-normal text-muted-foreground ml-2">({totalItems} en total)</span>
                        </h1>
                        <p className="text-muted-foreground">Gestión y administración del personal médico</p>
                    </div>
                </div>

                {/* Filtros y búsqueda */}
                <div className="flex flex-wrap gap-3 mb-6 items-center">
                    {filterButtons.map((btn) => (
                        <button
                            key={btn.value}
                            onClick={() => handleStatusChange(btn.value as any)}
                            className={`px-4 py-2 rounded-full font-medium shadow-sm transition-all duration-300 ${statusFilter === btn.value && !selectedSpecialty
                                    ? `${btn.activeClass} shadow-md scale-105`
                                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                                }`}
                        >
                            {btn.label}
                        </button>
                    ))}

                    <select
                        value={selectedSpecialty}
                        onChange={(e) => handleSpecialtyChange(e.target.value)}
                        className="px-4 py-2 rounded-full border border-border bg-input text-foreground shadow-sm hover:border-primary focus:ring-2 focus:ring-primary transition-colors duration-300"
                    >
                        <option value="">Todas las especialidades</option>
                        {specialties.map((spec) => (
                            <option key={spec.id} value={spec.nombre}>
                                {spec.nombre} ({spec.departamento?.nombre || "Sin departamento"})
                            </option>
                        ))}
                    </select>

                    <div className="flex items-center border border-border rounded-full px-4 py-2 bg-input shadow-sm focus-within:ring-2 focus-within:ring-primary w-full sm:w-80 ml-auto transition-colors duration-300">
                        <Search className="text-muted-foreground mr-2" size={18} />
                        <input
                            type="text"
                            placeholder="Buscar por nombre o identificación..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
                        />
                    </div>
                </div>

                {/* Contenido principal */}
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="flex flex-col items-center">
                            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-muted-foreground mt-4">Cargando doctores...</p>
                        </div>
                    </div>
                ) : error ? (
                    <div className="flex justify-center items-center h-64">
                        <p className="text-destructive text-center">{error}</p>
                    </div>
                ) : doctors.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-center">
                        <div className="w-20 h-20 mb-4 bg-muted rounded-full flex items-center justify-center">
                            <Stethoscope className="w-10 h-10 text-muted-foreground" />
                        </div>
                        <p className="text-lg font-medium text-foreground">No se encontraron doctores.</p>
                        <p className="text-sm text-muted-foreground">
                            Intenta cambiar los filtros o realizar otra búsqueda.
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {doctors.map((doctor) => (
                                <DoctorCard
                                    key={doctor.id}
                                    doctor={doctor}
                                    onDelete={handleDeleteDoctor}
                                    onUpdate={fetchDoctors}
                                />
                            ))}
                        </div>

                        {/* Paginación */}
                        <div className="flex items-center justify-center mt-8 gap-4">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="px-4 py-2 rounded-lg bg-muted text-muted-foreground hover:bg-muted/80 disabled:opacity-50 transition-colors duration-300"
                            >
                                ← Anterior
                            </button>
                            <span className="text-foreground font-medium">
                                Página <span className="font-bold text-primary">{currentPage}</span> de {totalPages}
                            </span>
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="px-4 py-2 rounded-lg bg-muted text-muted-foreground hover:bg-muted/80 disabled:opacity-50 transition-colors duration-300"
                            >
                                Siguiente →
                            </button>
                        </div>
                    </>
                )}
            </div>
        </DashboardLayout>
    );
}
