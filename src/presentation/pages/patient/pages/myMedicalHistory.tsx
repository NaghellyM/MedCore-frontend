import { useAuth } from '../../../../core/context/authContext';
import { DashboardLayout } from "../../../layouts/dashboardLayout";
import { PatientSidebar } from '../components/patientSidebar';
import { MedicalHistoryView } from '../../medicalHistory/pages/medicalHistoryView';
import { usePatientMedicalHistory } from '../../../../core/hooks/medicalHistory/useMedicalHistory';
import { LoadingState, ErrorState } from '../../medicalHistory/components/StateComponents';

export function MyMedicalHistory() {
    const { user } = useAuth();
    const patientId = user?.id || null;

    const {
        history,
        isLoading,
        isError,
        errorMessage,
    } = usePatientMedicalHistory(patientId);

    return (
        <DashboardLayout
            sidebar={<PatientSidebar />}
            showSearch={false}
            headerHeightClass="pt-[80px]"
            contentMaxWidthClass="max-w-7xl"
            variant="inset"
            collapsible="icon"
        >
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6">
                <header>
                    <h1 className="text-2xl font-semibold text-foreground">
                        Mi Historia Clínica
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Consulta tu historial médico completo
                    </p>
                </header>

                {isLoading && <LoadingState message="Cargando tu historia clínica..." />}
                
                {isError && (
                    <ErrorState
                        title="Error al cargar tu historia clínica"
                        message={errorMessage}
                    />
                )}

                {!isLoading && !isError && history && (
                    <MedicalHistoryView 
                        history={history}
                        showStatistics={true}
                        showFilters={false}
                    />
                )}
            </div>
        </DashboardLayout>
    );
}
