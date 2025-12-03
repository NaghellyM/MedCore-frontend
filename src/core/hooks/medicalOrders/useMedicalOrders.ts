/**
 * Hook para manejar operaciones CRUD de órdenes médicas
 * Soporta órdenes de laboratorio y radiología
 * Actualizado para coincidir con la API del backend
 */

import { useState, useCallback } from 'react';
import { medicalOrdersService } from '../../services/medicalOrdersService';
import type {
    MedicalOrderEntity,
    MedicalOrdersFilterParams,
    CreateLaboratoryOrderDto,
    CreateRadiologyOrderDto,
    MedicalOrderStatus,
} from '../../types/medicalOrders';

export interface UseMedicalOrdersState {
    orders: MedicalOrderEntity[];
    selectedOrder: MedicalOrderEntity | null;
    loading: boolean;
    error: string | null;
    total: number;
}

export interface UseMedicalOrdersReturn extends UseMedicalOrdersState {
    // Acciones de lectura
    fetchOrders: (params?: MedicalOrdersFilterParams) => Promise<void>;
    fetchOrdersByPatient: (patientId: string) => Promise<void>;
    fetchOrdersByDoctor: (doctorId: string) => Promise<void>;
    fetchOrderById: (orderId: string) => Promise<void>;
    fetchLaboratoryOrders: (patientId: string) => Promise<void>;
    fetchRadiologyOrders: (patientId: string) => Promise<void>;
    fetchPendingOrders: (patientId: string) => Promise<void>;
    fetchCompletedOrders: (patientId: string) => Promise<void>;

    // Acciones de escritura
    createLaboratoryOrder: (data: CreateLaboratoryOrderDto) => Promise<MedicalOrderEntity>;
    createRadiologyOrder: (data: CreateRadiologyOrderDto) => Promise<MedicalOrderEntity>;

    // Utilidades
    refetch: () => Promise<void>;
    reset: () => void;
    clearError: () => void;
    selectOrder: (order: MedicalOrderEntity | null) => void;

    // Filtros por estado (en memoria)
    getOrdersByStatus: (status: MedicalOrderStatus) => MedicalOrderEntity[];
    getOrdersByType: (type: 'LABORATORY' | 'RADIOLOGY') => MedicalOrderEntity[];
}

export const useMedicalOrders = (): UseMedicalOrdersReturn => {
    const [orders, setOrders] = useState<MedicalOrderEntity[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<MedicalOrderEntity | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [total, setTotal] = useState(0);
    const [lastParams, setLastParams] = useState<MedicalOrdersFilterParams | undefined>();

    /**
     * Obtiene órdenes médicas con filtros opcionales
     */
    const fetchOrders = useCallback(async (params?: MedicalOrdersFilterParams) => {
        try {
            setLoading(true);
            setError(null);
            setLastParams(params);

            const ordersArray = await medicalOrdersService.getOrders(params);

            if (Array.isArray(ordersArray)) {
                setOrders(ordersArray);
                setTotal(ordersArray.length);
            } else {
                setOrders([]);
                setTotal(0);
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al obtener órdenes médicas';
            setError(errorMessage);
            setOrders([]);
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Obtiene todas las órdenes de un paciente
     */
    const fetchOrdersByPatient = useCallback(async (patientId: string) => {
        try {
            setLoading(true);
            setError(null);
            setLastParams({ patientId });

            const ordersArray = await medicalOrdersService.getOrdersByPatientId(patientId);

            if (Array.isArray(ordersArray)) {
                setOrders(ordersArray);
                setTotal(ordersArray.length);
            } else {
                setOrders([]);
                setTotal(0);
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al obtener órdenes del paciente';
            setError(errorMessage);
            setOrders([]);
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Obtiene todas las órdenes de un doctor
     */
    const fetchOrdersByDoctor = useCallback(async (doctorId: string) => {
        try {
            setLoading(true);
            setError(null);
            setLastParams({ doctorId });

            const ordersArray = await medicalOrdersService.getOrdersByDoctorId(doctorId);

            if (Array.isArray(ordersArray)) {
                setOrders(ordersArray);
                setTotal(ordersArray.length);
            } else {
                setOrders([]);
                setTotal(0);
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al obtener órdenes del doctor';
            setError(errorMessage);
            setOrders([]);
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Obtiene una orden específica por ID
     */
    const fetchOrderById = useCallback(async (orderId: string) => {
        try {
            setLoading(true);
            setError(null);

            const order = await medicalOrdersService.getOrderById(orderId);

            if (order) {
                setSelectedOrder(order);
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al obtener la orden';
            setError(errorMessage);
            setSelectedOrder(null);
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Obtiene órdenes de laboratorio de un paciente
     */
    const fetchLaboratoryOrders = useCallback(async (patientId: string) => {
        try {
            setLoading(true);
            setError(null);
            setLastParams({ patientId, type: 'LABORATORY' });

            const ordersArray = await medicalOrdersService.getLaboratoryOrdersByPatient(patientId);

            if (Array.isArray(ordersArray)) {
                setOrders(ordersArray);
                setTotal(ordersArray.length);
            } else {
                setOrders([]);
                setTotal(0);
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al obtener órdenes de laboratorio';
            setError(errorMessage);
            setOrders([]);
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Obtiene órdenes de radiología de un paciente
     */
    const fetchRadiologyOrders = useCallback(async (patientId: string) => {
        try {
            setLoading(true);
            setError(null);
            setLastParams({ patientId, type: 'RADIOLOGY' });

            const ordersArray = await medicalOrdersService.getRadiologyOrdersByPatient(patientId);

            if (Array.isArray(ordersArray)) {
                setOrders(ordersArray);
                setTotal(ordersArray.length);
            } else {
                setOrders([]);
                setTotal(0);
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al obtener órdenes de radiología';
            setError(errorMessage);
            setOrders([]);
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Obtiene órdenes pendientes de un paciente
     */
    const fetchPendingOrders = useCallback(async (patientId: string) => {
        try {
            setLoading(true);
            setError(null);
            setLastParams({ patientId, status: 'PENDING' });

            const ordersArray = await medicalOrdersService.getPendingOrdersByPatient(patientId);

            if (Array.isArray(ordersArray)) {
                setOrders(ordersArray);
                setTotal(ordersArray.length);
            } else {
                setOrders([]);
                setTotal(0);
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al obtener órdenes pendientes';
            setError(errorMessage);
            setOrders([]);
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Obtiene órdenes completadas de un paciente
     */
    const fetchCompletedOrders = useCallback(async (patientId: string) => {
        try {
            setLoading(true);
            setError(null);
            setLastParams({ patientId, status: 'COMPLETED' });

            const ordersArray = await medicalOrdersService.getCompletedOrdersByPatient(patientId);

            if (Array.isArray(ordersArray)) {
                setOrders(ordersArray);
                setTotal(ordersArray.length);
            } else {
                setOrders([]);
                setTotal(0);
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al obtener órdenes completadas';
            setError(errorMessage);
            setOrders([]);
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Crea una nueva orden de laboratorio
     */
    const createLaboratoryOrder = useCallback(async (
        data: CreateLaboratoryOrderDto
    ): Promise<MedicalOrderEntity> => {
        try {
            setLoading(true);
            setError(null);

            const newOrder = await medicalOrdersService.createLaboratoryOrder(data);

            // Agregar la nueva orden al estado local
            setOrders(prev => [newOrder, ...prev]);
            setTotal(prev => prev + 1);

            return newOrder;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al crear orden de laboratorio';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Crea una nueva orden de radiología
     */
    const createRadiologyOrder = useCallback(async (
        data: CreateRadiologyOrderDto
    ): Promise<MedicalOrderEntity> => {
        try {
            setLoading(true);
            setError(null);

            const newOrder = await medicalOrdersService.createRadiologyOrder(data);

            // Agregar la nueva orden al estado local
            setOrders(prev => [newOrder, ...prev]);
            setTotal(prev => prev + 1);

            return newOrder;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al crear orden de radiología';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Refresca los datos usando los últimos parámetros
     */
    const refetch = useCallback(async () => {
        if (lastParams?.patientId) {
            await fetchOrdersByPatient(lastParams.patientId);
        } else {
            await fetchOrders(lastParams);
        }
    }, [fetchOrders, fetchOrdersByPatient, lastParams]);

    /**
     * Resetea el estado del hook
     */
    const reset = useCallback(() => {
        setOrders([]);
        setSelectedOrder(null);
        setLoading(false);
        setError(null);
        setTotal(0);
        setLastParams(undefined);
    }, []);

    /**
     * Limpia el error actual
     */
    const clearError = useCallback(() => {
        setError(null);
    }, []);

    /**
     * Selecciona una orden
     */
    const selectOrder = useCallback((order: MedicalOrderEntity | null) => {
        setSelectedOrder(order);
    }, []);

    /**
     * Filtra órdenes por estado (en memoria)
     */
    const getOrdersByStatus = useCallback((status: MedicalOrderStatus): MedicalOrderEntity[] => {
        return orders.filter(order => order.status === status);
    }, [orders]);

    /**
     * Filtra órdenes por tipo (en memoria)
     */
    const getOrdersByType = useCallback((type: 'LABORATORY' | 'RADIOLOGY'): MedicalOrderEntity[] => {
        return orders.filter(order => order.type === type);
    }, [orders]);

    return {
        // Estado
        orders,
        selectedOrder,
        loading,
        error,
        total,

        // Acciones de lectura
        fetchOrders,
        fetchOrdersByPatient,
        fetchOrdersByDoctor,
        fetchOrderById,
        fetchLaboratoryOrders,
        fetchRadiologyOrders,
        fetchPendingOrders,
        fetchCompletedOrders,

        // Acciones de escritura
        createLaboratoryOrder,
        createRadiologyOrder,

        // Utilidades
        refetch,
        reset,
        clearError,
        selectOrder,
        getOrdersByStatus,
        getOrdersByType,
    };
};
