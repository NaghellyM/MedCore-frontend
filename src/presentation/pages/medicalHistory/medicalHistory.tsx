import React from 'react';
import { ViewPatientMedicalHistoryPage } from './views/medicalHistoryPageView';
import { AutoDashboardLayout } from '../../layouts/autoDashboardLayout';

export const MedicalHistoryPage: React.FC = () => {
    return (
        <SmartDashboardLayout
            headerHeightClass="pt-[80px]"
            showSearch={true}
            contentMaxWidthClass="max-w-7xl"
            variant="inset"
            collapsible="icon"
            sidebarStrategy="existing"
        >
            <ViewPatientMedicalHistoryPage />
        </SmartDashboardLayout>
    );
};