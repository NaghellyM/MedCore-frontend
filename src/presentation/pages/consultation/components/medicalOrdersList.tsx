import { memo, useState } from 'react';
import { cn } from '../../../../core/utils/cn';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { 
    ClipboardList, 
    Plus,
    TestTube,
    Radio,
    Loader2,
    Eye,
    Clock,
    CheckCircle2,
    AlertCircle,
    XCircle,
    RefreshCw
} from 'lucide-react';
import { MedicalOrdersForm } from './MedicalOrdersForm';
import { useMedicalOrders } from '../../../../core/hooks/medicalOrders';
import { useAuth } from '../../../../core/context/authContext';
import type { MedicalOrderEntity, MedicalOrderType, MedicalOrderStatus } from '../../../../core/types/medicalOrders';

interface MedicalOrdersListProps {
    orders?: MedicalOrderEntity[];
    patientId?: string | null;
    loading?: boolean;
    onAddLaboratory?: () => void;
    onAddRadiology?: () => void;
    onView?: (orderId: string) => void;
    onRefresh?: () => void;
    className?: string;
}

// Mapeo de estados a colores y etiquetas (usando mayúsculas como el backend)
const STATUS_CONFIG: Record<MedicalOrderStatus, { label: string; color: string; icon: React.ComponentType<{ className?: string }> }> = {
    PENDING: { 
        label: 'Pendiente', 
        color: 'bg-amber-100 text-amber-700 border-amber-300',
        icon: Clock
    },
    IN_PROGRESS: { 
        label: 'En Proceso', 
        color: 'bg-blue-100 text-blue-700 border-blue-300',
        icon: Loader2
    },
    COMPLETED: { 
        label: 'Completado', 
        color: 'bg-green-100 text-green-700 border-green-300',
        icon: CheckCircle2
    },
    CANCELLED: { 
        label: 'Cancelado', 
        color: 'bg-red-100 text-red-700 border-red-300',
        icon: XCircle
    },
};

// Mapeo de tipos de examen a etiquetas legibles (valores del backend)
const EXAM_TYPE_LABELS: Record<string, string> = {
    // Laboratorio
    'Hemograma': 'Hemograma',
    'Quimica sanguinea': 'Química Sanguínea',
    'Orina': 'Examen de Orina',
    // Radiología
    'Rayos X': 'Rayos X',
    'TAC': 'Tomografía (TAC)',
    'Resonancia': 'Resonancia Magnética',
    'Ecografia': 'Ecografía',
};

/**
 * Componente que muestra la lista de órdenes médicas en la consulta
 */
export const MedicalOrdersList = memo(function MedicalOrdersList({
    orders: externalOrders,
    patientId,
    loading: externalLoading,
    onView,
    onRefresh,
    className,
}: MedicalOrdersListProps) {
    const { user } = useAuth();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [initialOrderType, setInitialOrderType] = useState<MedicalOrderType>('laboratory');
    
    const { 
        orders: hookOrders, 
        loading: hookLoading,
        fetchOrdersByPatient 
    } = useMedicalOrders();

    // Usar órdenes externas si se proveen, sino usar las del hook
    const orders = externalOrders ?? hookOrders;
    const loading = externalLoading ?? hookLoading;

    // Handlers para abrir el formulario
    const handleAddLaboratory = () => {
        setInitialOrderType('laboratory');
        setIsFormOpen(true);
    };

    const handleAddRadiology = () => {
        setInitialOrderType('radiology');
        setIsFormOpen(true);
    };

    // Handler para cuando se crea una orden exitosamente
    const handleOrderCreated = async () => {
        if (onRefresh) {
            onRefresh();
        } else if (patientId) {
            await fetchOrdersByPatient(patientId);
        }
    };

    // Formatear fecha
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Obtener etiqueta del tipo de examen
    const getExamLabel = (examType: string) => {
        return EXAM_TYPE_LABELS[examType] || examType;
    };

    // Separar órdenes por tipo (usando mayúsculas como el backend)
    const laboratoryOrders = orders.filter(o => o.type === 'LABORATORY');
    const radiologyOrders = orders.filter(o => o.type === 'RADIOLOGY');

    return (
        <>
            <Card className={cn(
                "border-2 border-cyan-200 bg-gradient-to-br from-white to-cyan-50/30",
                className
            )}>
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-lg font-semibold flex items-center gap-2">
                            <ClipboardList className="h-5 w-5 text-cyan-600" />
                            Órdenes Médicas
                            {orders.length > 0 && (
                                <Badge variant="secondary" className="ml-2">
                                    {orders.length}
                                </Badge>
                            )}
                        </CardTitle>
                        <div className="flex items-center gap-2">
                            {onRefresh && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={onRefresh}
                                    disabled={loading}
                                    className="h-8 w-8 p-0"
                                >
                                    <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
                                </Button>
                            )}
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="space-y-4">
                    {/* Botones para agregar órdenes */}
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleAddLaboratory}
                            disabled={!patientId}
                            className="flex-1 border-cyan-300 text-cyan-700 hover:bg-cyan-50"
                        >
                            <TestTube className="h-4 w-4 mr-2" />
                            Laboratorio
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleAddRadiology}
                            disabled={!patientId}
                            className="flex-1 border-indigo-300 text-indigo-700 hover:bg-indigo-50"
                        >
                            <Radio className="h-4 w-4 mr-2" />
                            Radiología
                        </Button>
                    </div>

                    {/* Estado de carga */}
                    {loading && (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="h-6 w-6 animate-spin text-cyan-600" />
                            <span className="ml-2 text-sm text-slate-500">Cargando órdenes...</span>
                        </div>
                    )}

                    {/* Lista vacía */}
                    {!loading && orders.length === 0 && (
                        <div className="p-6 bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-200 rounded-lg text-center">
                            <div className="flex justify-center gap-4 mb-4">
                                <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center">
                                    <TestTube className="h-6 w-6 text-cyan-500" />
                                </div>
                                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                                    <Radio className="h-6 w-6 text-indigo-500" />
                                </div>
                            </div>
                            <h3 className="text-lg font-semibold text-slate-800 mb-2">
                                Sin órdenes médicas
                            </h3>
                            <p className="text-sm text-slate-600 max-w-xs mx-auto">
                                No hay órdenes registradas. Utiliza los botones de arriba para crear órdenes de laboratorio o radiología.
                            </p>
                        </div>
                    )}

                    {/* Lista de órdenes */}
                    {!loading && orders.length > 0 && (
                        <div className="space-y-4">
                            {/* Órdenes de Laboratorio */}
                            {laboratoryOrders.length > 0 && (
                                <div className="space-y-2">
                                    <h4 className="text-sm font-medium text-cyan-700 flex items-center gap-2">
                                        <TestTube className="h-4 w-4" />
                                        Laboratorio ({laboratoryOrders.length})
                                    </h4>
                                    <div className="space-y-2">
                                        {laboratoryOrders.map((order) => (
                                            <OrderCard 
                                                key={order.id} 
                                                order={order} 
                                                onView={onView}
                                                formatDate={formatDate}
                                                getExamLabel={getExamLabel}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Órdenes de Radiología */}
                            {radiologyOrders.length > 0 && (
                                <div className="space-y-2">
                                    <h4 className="text-sm font-medium text-indigo-700 flex items-center gap-2">
                                        <Radio className="h-4 w-4" />
                                        Radiología ({radiologyOrders.length})
                                    </h4>
                                    <div className="space-y-2">
                                        {radiologyOrders.map((order) => (
                                            <OrderCard 
                                                key={order.id} 
                                                order={order} 
                                                onView={onView}
                                                formatDate={formatDate}
                                                getExamLabel={getExamLabel}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Modal del formulario */}
            {patientId && user?.id && (
                <MedicalOrdersForm
                    isOpen={isFormOpen}
                    onClose={() => setIsFormOpen(false)}
                    onSuccess={handleOrderCreated}
                    patientId={patientId}
                    doctorId={user.id}
                    initialOrderType={initialOrderType}
                />
            )}
        </>
    );
});

// Componente interno para cada orden
interface OrderCardProps {
    order: MedicalOrderEntity;
    onView?: (orderId: string) => void;
    formatDate: (date: string) => string;
    getExamLabel: (examType: string) => string;
}

function OrderCard({ order, onView, formatDate, getExamLabel }: OrderCardProps) {
    const statusConfig = STATUS_CONFIG[order.status] || STATUS_CONFIG.PENDING;
    const StatusIcon = statusConfig.icon;

    return (
        <div 
            className={cn(
                "p-3 rounded-lg border bg-white hover:shadow-sm transition-shadow",
                order.type === 'LABORATORY' ? 'border-cyan-200' : 'border-indigo-200'
            )}
        >
            <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-slate-800 truncate">
                            {getExamLabel(order.examType)}
                        </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Clock className="h-3 w-3" />
                        {formatDate(order.createdAt)}
                    </div>
                    {order.notes && (
                        <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                            {order.notes}
                        </p>
                    )}
                </div>
                <div className="flex flex-col items-end gap-2">
                    <Badge variant="outline" className={statusConfig.color}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {statusConfig.label}
                    </Badge>
                    {onView && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onView(order.id)}
                            className="h-7 px-2 text-xs"
                        >
                            <Eye className="h-3 w-3 mr-1" />
                            Ver
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}

