import React from 'react';
import { DashboardLayout } from "../../layouts/layout";
import { PatientSidebar } from '../patient/components/patientSidebar';
import { ViewMyMedicalHistoryPage } from './pages/MyMedicalHistoryPageView';

export const MyMedicalHistoryPage: React.FC = () => {
    return (
        <DashboardLayout sidebar={<PatientSidebar />}>
            <ViewMyMedicalHistoryPage />
        </DashboardLayout>
    );
};