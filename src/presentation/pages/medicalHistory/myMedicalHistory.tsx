import React from 'react';
import { DashboardLayout } from "../../layouts/layout";
import { PatientSidebar } from '../patient/components/patientSidebar';
import { ViewMyMedicalHistoryPage } from './views/myMedicalHistoryPageView';

export const MyMedicalHistoryPage: React.FC = () => {
    return (
        <DashboardLayout sidebar={<PatientSidebar />}>
            <ViewMyMedicalHistoryPage />
        </DashboardLayout>
    );
};