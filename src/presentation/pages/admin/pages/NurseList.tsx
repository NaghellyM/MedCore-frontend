import { useEffect, useState } from "react";
import NurseCard from "../../nurse/components/nurseCard";
import { nursesService } from "../../../../core/services/nursesService";
import { Search, ArrowLeftCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useToast } from "../../../../core/hooks/notifications";

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
  const navigate = useNavigate();
  const { success, error: showError } = useToast();

  // 🔹 Normalizar status
  const normalizeStatus = (status?: string): "ACTIVE" | "INACTIVE" | "PENDING" | "UNKNOWN" => {
    const normalized = (status || "UNKNOWN").toUpperCase();
    const validStatuses: ("ACTIVE" | "INACTIVE" | "PENDING" | "UNKNOWN")[] = ["ACTIVE", "INACTIVE", "PENDING", "UNKNOWN"];
    return validStatuses.includes(normalized as any) ? normalized as any : "UNKNOWN";
  };

  // 🔹 Debounce para búsqueda
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
      if (searchTerm.trim()) setStatusFilter("");
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // 🔹 Obtener enfermeros
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

  // 🔹 Editar enfermero desde el mismo card
  const handleEditNurse = async (updatedNurse: NurseApi) => {
    try {
      // Solo enviamos propiedades que tengan valor y excluimos 'identificacion'
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

      // Use toast for successful CRUD operations (non-blocking feedback)
      success("Enfermero actualizado", "Los datos se actualizaron correctamente");
    } catch (error) {
      // Use toast for CRUD errors (quick feedback)
      showError("Error al actualizar", "No se pudo actualizar el enfermero");
    }
  };

  // 🔹 Eliminar enfermero con confirmación
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

        // Use toast for successful deletion feedback (non-blocking)
        success("Enfermero eliminado", "El enfermero fue eliminado correctamente");
      } catch (error) {
        // Use toast for deletion errors (quick feedback)
        showError("Error al eliminar", "No se pudo eliminar el enfermero. Inténtalo nuevamente");
      }
    }
  };

  // 🔹 Filtros
  const handleStatusChange = (status: "active" | "inactive" | "pending" | "") => {
    setStatusFilter(status);
    setSearchTerm("");
    setCurrentPage(1);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
  };

  return (
    <div className="p-6 space-y-6">
      {/* 🔹 Título y botón */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold text-gray-800">👩‍⚕️ Listado de Enfermeros</h1>
        <button
          onClick={() => navigate("/adminpage")}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full shadow-md hover:from-blue-600 hover:to-blue-700 transition-all duration-300 hover:scale-105 focus:ring-4 focus:ring-blue-300"
        >
          <ArrowLeftCircle size={22} />
          <span>Volver al panel</span>
        </button>
      </div>

      {/* 🔹 Filtros y búsqueda */}
      <div className="flex flex-wrap gap-3 mb-6 items-center">
        {[{ label: "Todos", value: "" },
        { label: "Activos", value: "active" },
        { label: "Inactivos", value: "inactive" },
        { label: "Pendientes", value: "pending" }].map((btn) => (
          <button
            key={btn.value}
            onClick={() => handleStatusChange(btn.value as any)}
            className={`px-4 py-2 rounded-full font-medium shadow transition ${statusFilter === btn.value
                ? btn.value === "active"
                  ? "bg-green-600 text-white shadow-md scale-105"
                  : btn.value === "inactive"
                    ? "bg-red-600 text-white shadow-md scale-105"
                    : btn.value === "pending"
                      ? "bg-yellow-500 text-white shadow-md scale-105"
                      : "bg-blue-600 text-white shadow-md scale-105"
                : "bg-gray-200 hover:bg-gray-300"
              }`}
          >
            {btn.label}
          </button>
        ))}

        <div className="flex items-center border border-gray-300 rounded-full px-4 py-2 bg-white shadow-sm focus-within:ring-2 focus-within:ring-blue-300 w-full sm:w-80 ml-auto transition">
          <Search className="text-gray-400 mr-2" size={18} />
          <input
            type="text"
            placeholder="Buscar por nombre o identificación..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent outline-none text-gray-700 placeholder-gray-400"
          />
        </div>
      </div>

      {/* 🔹 Contenido principal */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-500 mt-4">Cargando enfermeros...</p>
          </div>
        </div>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : nurses.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-center text-gray-500">
          <img
            src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png"
            alt="Sin resultados"
            className="w-20 h-20 mb-4 opacity-70"
          />
          <p className="text-lg font-medium">No se encontraron enfermeros.</p>
          <p className="text-sm text-gray-400">
            Intenta cambiar los filtros o realizar otra búsqueda.
          </p>
        </div>
      ) : (
        <>
          {/* 🔹 Cards */}
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

          {/* 🔹 Paginación */}
          <div className="flex items-center justify-center mt-8 gap-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50 transition"
            >
              ← Anterior
            </button>
            <span className="text-gray-700 font-medium">
              Página <span className="font-bold">{currentPage}</span> de {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50 transition"
            >
              Siguiente →
            </button>
          </div>
        </>
      )}
    </div>
  );
}
