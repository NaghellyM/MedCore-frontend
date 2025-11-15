import React from 'react';
import { DashboardLayout } from "../../layouts/layout";
import { PatientSidebar } from '../patient/components/patientSidebar';
import { ViewPatientMedicalHistoryPage } from './pages/MedicalHistoryPageView';

export const MedicalHistoryPage: React.FC = () => {
    return (<DashboardLayout
        sidebar={<PatientSidebar />}>
        <ViewPatientMedicalHistoryPage />
    </DashboardLayout>);
};