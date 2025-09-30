import { Table, TableBody, TableRow, TableCell, TableHeader, TableHead } from "../ui/table";

export function PatientTable({ data }: any) {
    return (
        <Table className="min-w-full bg-white shadow-md border-collapse font-sans">
            <TableHeader className="bg-cuidarte-secondary text-left border-s-2 font-sans">
                <TableRow>
                    <TableHead className="px-4 py-2 rounded-tl-lg">Paciente</TableHead>
                    <TableHead className="px-4 py-2">Habitación</TableHead>
                    <TableHead className="px-4 py-2">Alertas</TableHead>
                    <TableHead className="px-4 py-2">Prioridad</TableHead>
                    <TableHead className="px-4 py-2">Historial</TableHead>
                    <TableHead className="px-4 py-2 rounded-tr-lg">Última Actualización</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {data.map((patient: any) => (
                    <TableRow key={patient.name} className="hover:bg-gray-50">
                        <TableCell className="px-2 py-2">{patient.name}</TableCell>
                        <TableCell className="px-4 py-2">{patient.room}</TableCell>
                        <TableCell className="px-4 py-2">{patient.alertColor}</TableCell>
                        <TableCell className="px-4 py-2">{patient.priority}</TableCell>
                        <TableCell className="px-4 py-2">Ver Historial</TableCell>
                        <TableCell className="px-4 py-2">{patient.lastUpdate}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
