import { memo } from 'react';
import { cn } from '../../../../core/utils/cn';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { 
    ClipboardList, 
    Clock,
    TestTube,
    Radio
} from 'lucide-react';

interface MedicalOrdersListProps {
    orders?: unknown[];
    patientId?: string | null;
    loading?: boolean;
    onAddLaboratory?: () => void;
    onAddRadiology?: () => void;
    onView?: (orderId: string) => void;
    className?: string;
}

/**
 * Componente que muestra la lista de órdenes médicas en la consulta
 * ESTADO: Próximo a implementar
 */
export const MedicalOrdersList = memo(function MedicalOrdersList({
    className,
}: MedicalOrdersListProps) {
    return (
        <Card className={cn(
            "border-2 border-cyan-200 bg-gradient-to-br from-white to-cyan-50/30",
            className
        )}>
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        <ClipboardList className="h-5 w-5 text-cyan-600" />
                        Órdenes Médicas
                    </CardTitle>
                    <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-300">
                        <Clock className="h-3 w-3 mr-1" />
                        Próximamente
                    </Badge>
                </div>
            </CardHeader>

            <CardContent>
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
                        Próximo a implementar
                    </h3>
                    <p className="text-sm text-slate-600 max-w-xs mx-auto">
                        El módulo de órdenes médicas estará disponible próximamente. 
                        Podrás crear órdenes de laboratorio y radiología.
                    </p>
                </div>
            </CardContent>
        </Card>
    );
});
