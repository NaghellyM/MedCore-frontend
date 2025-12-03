import React from 'react';
import { useParams } from 'react-router-dom';
import { DashboardLayout } from "../../../layouts/dashboardLayout";
import DoctorSidebar from '../../doctor/components/doctorSideBar';
import { PatientMedicalSummaryView } from './patientMedicalSummaryView';

export const PatientMedicalSummaryPageWrapper: React.FC = () => {
    const { patientId } = useParams<{ patientId: string }>();

    if (!patientId) {
        return (
            <DashboardLayout sidebar={<DoctorSidebar />}>
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <h2 className="text-xl font-semibold text-slate-900 mb-2">
                            ID de paciente requerido
                        </h2>
                        <p className="text-slate-600">
                            No se pudo identificar el paciente para mostrar el resumen médico.
                        </p>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout sidebar={<DoctorSidebar />}>
            <PatientMedicalSummaryView 
                patientId={patientId}
                showTimeline={true}
                showStatistics={true}
                showPatientInfo={true}
            />
        </DashboardLayout>
    );
};