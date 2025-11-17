import React from 'react';
import { DashboardLayout } from "../../../layouts/layout";
import DoctorSidebar from '../../doctor/components/doctorSideBar';
import { MedicalHistoriesListView } from './medicalHistoriesListView';

export const MedicalHistoriesListPageWrapper: React.FC = () => {
    return (
        <DashboardLayout sidebar={<DoctorSidebar />}>
            <MedicalHistoriesListView 
                showFilters={true}
                enableNavigation={true}
            />
        </DashboardLayout>
    );
};