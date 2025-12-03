import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import {
    Users,
    Calendar,
    AlertCircle,
    Clock,
    ArrowRight
} from "lucide-react";

/**
 * Componente de estadísticas rápidas para el dashboard del médico
 */
export function QuickStats() {
    const navigate = useNavigate();

    const stats = [
        {
            title: "Pacientes en Cola",
            value: "5",
            icon: <Users className="h-5 w-5 text-green-600" />,
            description: "Esperando atención",
            action: () => navigate("/queueDoctor"),
            bgColor: "bg-green-50 dark:bg-green-950/20",
            textColor: "text-green-600"
        },
        {
            title: "Citas Hoy",
            value: "8",
            icon: <Calendar className="h-5 w-5 text-blue-600" />,
            description: "Programadas",
            action: () => navigate("/doctorAppointmentsList"),
            bgColor: "bg-blue-50 dark:bg-blue-950/20",
            textColor: "text-blue-600"
        },
        {
            title: "Urgentes",
            value: "2",
            icon: <AlertCircle className="h-5 w-5 text-red-600" />,
            description: "Requieren atención",
            action: () => navigate("/queueDoctor"),
            bgColor: "bg-red-50 dark:bg-red-950/20",
            textColor: "text-red-600"
        },
        {
            title: "Próxima Cita",
            value: "10:30",
            icon: <Clock className="h-5 w-5 text-purple-600" />,
            description: "En 15 minutos",
            action: () => navigate("/doctorAppointmentsList"),
            bgColor: "bg-purple-50 dark:bg-purple-950/20",
            textColor: "text-purple-600"
        }
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, index) => (
                <Card
                    key={index}
                    className={`${stat.bgColor} border-none hover:shadow-lg transition-all duration-300 cursor-pointer group`}
                    onClick={stat.action}
                >
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
                            <span>{stat.title}</span>
                            {stat.icon}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-end justify-between">
                            <div>
                                <div className={`text-3xl font-bold ${stat.textColor}`}>
                                    {stat.value}
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {stat.description}
                                </p>
                            </div>
                            <Button
                                size="icon"
                                variant="ghost"
                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
