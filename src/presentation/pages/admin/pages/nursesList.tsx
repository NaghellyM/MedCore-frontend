import { useEffect, useState } from "react";
import NurseCard from "../../nurse/components/nurseCard";
import { nursesService } from "../../../../core/services/nursesService";
import { Search, Users } from "lucide-react";
import Swal from "sweetalert2";
import { useToast } from "../../../../core/hooks/notifications";
import { DashboardLayout } from "../../../layouts/dashboardLayout";
import { AdminSidebar } from "../components/adminSidebar";

interface NurseApi {
    id: string;
    fullname: string;
    identificacion: string;
    role?: string;
    status: "ACTIVE" | "INACTIVE" | "PENDING" | "UNKNOWN";
    email?: string;
    phone?: string;
    license_number?: string;
}

export default function NursesList() {
    const [nurses, setNurses] = useState<NurseApi[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [statusFilter, setStatusFilter] = useState<"active" | "inactive" | "pending" | "">("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const { success, error: showError } = useToast();

    // Normalizar status
    const normalizeStatus = (status?: string): "ACTIVE" | "INACTIVE" | "PENDING" | "UNKNOWN" => {
        const normalized = (status || "UNKNOWN").toUpperCase();
        const validStatuses: ("ACTIVE" | "INACTIVE" | "PENDING" | "UNKNOWN")[] = ["ACTIVE", "INACTIVE", "PENDING", "UNKNOWN"];
        return validStatuses.includes(normalized as any) ? normalized as any : "UNKNOWN";
    };

    // Debounce para búsqueda
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchTerm);
            setCurrentPage(1);
            if (searchTerm.trim()) setStatusFilter("");
        }, 500);
        return () => clearTimeout(handler);
    }, [searchTerm]);

    // Obtener enfermeros
    const fetchNurses = async () => {
        try {
            setLoading(true);
            setError(null);
            let response: any;

            if (debouncedSearch.trim()) {
                response = await nursesService.searchByNameOrId(debouncedSearch);
            } else if (statusFilter) {
                response = await nursesService.filterByStatus(statusFilter);
            } else {
                response = await nursesService.getAll(currentPage);
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

            setTotalPages(Math.ceil(total / itemsPerPage));

            const mappedNurses: NurseApi[] = users.map((n: any) => ({
                id: n.id,
                fullname: n.fullname,
                identificacion: n.identificacion || "N/A",
                role: n.role || undefined,
                status: normalizeStatus(n.status),
                email: n.email || undefined,
                phone: n.phone || undefined,
                license_number: n.license_number || undefined,
            }));

            setNurses(mappedNurses);
        } catch (err: any) {
            if (err.response?.status === 404) {
                setNurses([]);
                setError(null);
            } else {
                setError("Hubo un problema al cargar los enfermeros.");
                showError("Error al cargar enfermeros", "No se pudieron obtener los datos de los enfermeros.");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNurses();
    }, [statusFilter, currentPage, debouncedSearch]);

    // Editar enfermero desde el mismo card
    const handleEditNurse = async (updatedNurse: NurseApi) => {
        try {
            const payload: Partial<NurseApi> = {};
            Object.entries(updatedNurse).forEach(([key, value]) => {
                if (value !== null && value !== "" && key !== "identificacion") {
                    (payload as any)[key] = value;
                }
            });

            await nursesService.updateNurse(updatedNurse.id, payload);
            setNurses((prev) =>
                prev.map((n) => (n.id === updatedNurse.id ? updatedNurse : n))
            );

            success("Enfermero actualizado", "Los datos se actualizaron correctamente");
        } catch (error) {
            showError("Error al actualizar", "No se pudo actualizar el enfermero");
        }
    };

    // Eliminar enfermero con confirmación
    const handleDeleteNurse = async (id: string) => {
        const result = await Swal.fire({
            title: "¿Estás seguro?",
            text: "Esta acción eliminará permanentemente al enfermero.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
        });

        if (result.isConfirmed) {
            try {
                await nursesService.deleteNurse(id);
                setNurses((prev) => prev.filter((n) => n.id !== id));
                success("Enfermero eliminado", "El enfermero fue eliminado correctamente");
            } catch (error) {
                showError("Error al eliminar", "No se pudo eliminar el enfermero. Inténtalo nuevamente");
            }
        }
    };

    // Filtros
    const handleStatusChange = (status: "active" | "inactive" | "pending" | "") => {
        setStatusFilter(status);
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
        { label: "Pendientes", value: "pending", activeClass: "bg-warning text-warning-foreground" }
    ];

    return (
        <DashboardLayout sidebar={<AdminSidebar />} showSearch={false}>
            <div className="p-6 space-y-6">
                {/* Título */}
                <div className="flex items-center gap-3 mb-4">
                    <div className="bg-pink-100 dark:bg-pink-900/30 p-3 rounded-full">
                        <Users className="w-8 h-8 text-pink-600 dark:text-pink-400" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Listado de Enfermeros</h1>
                        <p className="text-muted-foreground">Gestión y administración del personal de enfermería</p>
                    </div>
                </div>

                {/* Filtros y búsqueda */}
                <div className="flex flex-wrap gap-3 mb-6 items-center">
                    {filterButtons.map((btn) => (
                        <button
                            key={btn.value}
                            onClick={() => handleStatusChange(btn.value as any)}
                            className={`px-4 py-2 rounded-full font-medium shadow-sm transition-all duration-300 ${statusFilter === btn.value
                                ? `${btn.activeClass} shadow-md scale-105`
                                : "bg-muted text-muted-foreground hover:bg-muted/80"
                                }`}
                        >
                            {btn.label}
                        </button>
                    ))}

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
                            <p className="text-muted-foreground mt-4">Cargando enfermeros...</p>
                        </div>
                    </div>
                ) : error ? (
                    <div className="flex justify-center items-center h-64">
                        <p className="text-destructive text-center">{error}</p>
                    </div>
                ) : nurses.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-center">
                        <div className="w-20 h-20 mb-4 bg-muted rounded-full flex items-center justify-center">
                            <Users className="w-10 h-10 text-muted-foreground" />
                        </div>
                        <p className="text-lg font-medium text-foreground">No se encontraron enfermeros.</p>
                        <p className="text-sm text-muted-foreground">
                            Intenta cambiar los filtros o realizar otra búsqueda.
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {nurses.map((nurse) => (
                                <NurseCard
                                    key={nurse.id}
                                    nurse={nurse}
                                    onEdit={handleEditNurse}
                                    onDelete={handleDeleteNurse}
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
