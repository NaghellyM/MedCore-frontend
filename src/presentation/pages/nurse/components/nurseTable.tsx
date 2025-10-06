import { BedDouble, Siren } from "lucide-react";
import { Table, TableBody, TableRow, TableCell, TableHeader, TableHead } from "../../../components/ui/table";

export function PatientTable({ data }: any) {

    const getAlertColor = (alertValue: number) => {
        if (alertValue <= 1) {
            return 'text-green-500';
        } else if (alertValue < 3) {
            return 'text-yellow-500';
        } else {
            return 'text-red-500';
        }
    };

    return (
        <div className="font-fjall rounded-lg overflow-hidden ring-1 ring-black/10 text-center">
            <Table className="w-full text-center font-fjall">
                <TableHeader className="bg-cuidarte-secondary text-black font-bold text-center font-fjall">
                    <TableRow>
                        <TableHead className="px-4 py-2 text-left">Paciente</TableHead>
                        <TableHead className="px-4 py-2 text-left">Habitación</TableHead>
                        <TableHead className="px-4 py-2 text-left">Alertas</TableHead>
                        <TableHead className="px-4 py-2 text-left">Prioridad</TableHead>
                        <TableHead className="px-4 py-2 text-left">Historial</TableHead>
                        <TableHead className="px-4 py-2 text-left">Última Actualización</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody className="divide-y divide-black/5">
                    {data.map((patient: any) => {
                        const alertValue = parseInt(patient.alert, 10);
                        const alertColor = getAlertColor(alertValue);

                        return (
                            <TableRow key={patient.name} className="hover:bg-black/5">
                                <TableCell className="px-4 py-2">{patient.name}</TableCell>

                                <TableCell className="px-4 py-2">
                                    <div className="flex items-center justify-center">
                                        <BedDouble />
                                        {patient.room}
                                    </div>
                                </TableCell>
                                <TableCell className="px-4 py-2">

                                    <div className={`flex items-center justify-center ${alertColor}`}>
                                        <Siren className="mr-2" />
                                        {patient.alert}
                                    </div>
                                </TableCell>
                                <TableCell className="px-4 py-2">{patient.priority}</TableCell>
                                <TableCell className="px-4 py-2">Ver Historial</TableCell>
                                <TableCell className="px-4 py-2">{patient.lastUpdate}</TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
}
