import React from 'react';
import { MedicalHistoriesListView } from './medicalHistoriesListView';
import { SmartDashboardLayout } from '../../../layouts/SmartDashboardLayout';

export const MedicalHistoriesListPageWrapper: React.FC = () => {
    return (
        <SmartDashboardLayout 
        sidebarStrategy="existing"
            headerHeightClass="pt-[80px]"
            showSearch={true}
            contentMaxWidthClass="max-w-7xl"
            variant="inset"
            collapsible="icon"
        >
            <MedicalHistoriesListView 
                showFilters={true}
                enableNavigation={true}
            />
        </SmartDashboardLayout>
    );
};