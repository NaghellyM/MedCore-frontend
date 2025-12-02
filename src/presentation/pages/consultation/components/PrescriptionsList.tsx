import { memo } from 'react';
import { cn } from '../../../../core/utils/cn';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { 
    Pill, 
    Clock
} from 'lucide-react';

interface PrescriptionsListProps {
    prescriptions?: unknown[];
    patientId?: string | null;
    loading?: boolean;
    onAdd?: () => void;
    onView?: (prescriptionId: string) => void;
    className?: string;
}

/**
 * Componente que muestra la lista de prescripciones en la consulta
 * ESTADO: Próximo a implementar
 */
export const PrescriptionsList = memo(function PrescriptionsList({
    className,
}: PrescriptionsListProps) {
    return (
        <Card className={cn(
            "border-2 border-orange-200 bg-gradient-to-br from-white to-orange-50/30",
            className
        )}>
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        <Pill className="h-5 w-5 text-orange-600" />
                        Prescripciones
                    </CardTitle>
                    <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-300">
                        <Clock className="h-3 w-3 mr-1" />
                        Próximamente
                    </Badge>
                </div>
            </CardHeader>

            <CardContent>
                <div className="p-6 bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 rounded-lg text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center">
                        <Pill className="h-8 w-8 text-orange-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">
                        Próximo a implementar
                    </h3>
                    <p className="text-sm text-slate-600 max-w-xs mx-auto">
                        El módulo de prescripciones estará disponible próximamente. 
                        Podrás crear y gestionar recetas médicas para tus pacientes.
                    </p>
                </div>
            </CardContent>
        </Card>
    );
});
