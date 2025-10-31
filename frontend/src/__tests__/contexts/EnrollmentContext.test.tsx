import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { EnrollmentProvider, useEnrollment } from '../../contexts/EnrollmentContext';
import type { Course } from '../../types/course';
import type { InstallmentPlan } from '../../types/installmentPlan';

const mockCourse: Course = {
    id: 1,
    modality: 'Graduação',
    period: 'Noturno',
    originalPrice: 1000.00,
    installmentPrice: 450.00,
    installments: 12,
    cashPrice: 900.00,
    description: null,
    type: 'Presencial',
    location: {
        city: 'Rio de Janeiro',
        unit: 'Campus Centro',
        address: 'Rua do Ouvidor, 123',
    },
};

const mockInstallmentPlan: InstallmentPlan = {
    id: 1,
    installments: 12,
    installmentValue: 450.00,
    totalPrice: 5400.00,
};

describe('EnrollmentContext', () => {
    describe('EnrollmentProvider', () => {
        it('should start with null values', () => {
            const { result } = renderHook(() => useEnrollment(), {
                wrapper: EnrollmentProvider,
            });

            expect(result.current.selectedCourse).toBeNull();
            expect(result.current.selectedInstallmentPlan).toBeNull();
        });

        it('should set selected course', () => {
            const { result } = renderHook(() => useEnrollment(), {
                wrapper: EnrollmentProvider,
            });

            act(() => {
                result.current.setSelectedCourse(mockCourse);
            });

            expect(result.current.selectedCourse).toEqual(mockCourse);
        });

        it('should set selected installment plan', () => {
            const { result } = renderHook(() => useEnrollment(), {
                wrapper: EnrollmentProvider,
            });

            act(() => {
                result.current.setSelectedInstallmentPlan(mockInstallmentPlan);
            });

            expect(result.current.selectedInstallmentPlan).toEqual(mockInstallmentPlan);
        });

        it('should set both course and installment plan', () => {
            const { result } = renderHook(() => useEnrollment(), {
                wrapper: EnrollmentProvider,
            });

            act(() => {
                result.current.setSelectedCourse(mockCourse);
                result.current.setSelectedInstallmentPlan(mockInstallmentPlan);
            });

            expect(result.current.selectedCourse).toEqual(mockCourse);
            expect(result.current.selectedInstallmentPlan).toEqual(mockInstallmentPlan);
        });

        it('should clear enrollment', () => {
            const { result } = renderHook(() => useEnrollment(), {
                wrapper: EnrollmentProvider,
            });

            // Define valores
            act(() => {
                result.current.setSelectedCourse(mockCourse);
                result.current.setSelectedInstallmentPlan(mockInstallmentPlan);
            });

            expect(result.current.selectedCourse).toEqual(mockCourse);
            expect(result.current.selectedInstallmentPlan).toEqual(mockInstallmentPlan);

            // Limpa
            act(() => {
                result.current.clearEnrollment();
            });

            expect(result.current.selectedCourse).toBeNull();
            expect(result.current.selectedInstallmentPlan).toBeNull();
        });

        it('should allow setting course to null', () => {
            const { result } = renderHook(() => useEnrollment(), {
                wrapper: EnrollmentProvider,
            });

            act(() => {
                result.current.setSelectedCourse(mockCourse);
            });

            expect(result.current.selectedCourse).toEqual(mockCourse);

            act(() => {
                result.current.setSelectedCourse(null);
            });

            expect(result.current.selectedCourse).toBeNull();
        });

        it('should allow setting installment plan to null', () => {
            const { result } = renderHook(() => useEnrollment(), {
                wrapper: EnrollmentProvider,
            });

            act(() => {
                result.current.setSelectedInstallmentPlan(mockInstallmentPlan);
            });

            expect(result.current.selectedInstallmentPlan).toEqual(mockInstallmentPlan);

            act(() => {
                result.current.setSelectedInstallmentPlan(null);
            });

            expect(result.current.selectedInstallmentPlan).toBeNull();
        });

        it('should allow changing course', () => {
            const { result } = renderHook(() => useEnrollment(), {
                wrapper: EnrollmentProvider,
            });

            const course2: Course = {
                ...mockCourse,
                id: 2,
                modality: 'Graduação EAD',
            };

            act(() => {
                result.current.setSelectedCourse(mockCourse);
            });

            expect(result.current.selectedCourse?.id).toBe(1);

            act(() => {
                result.current.setSelectedCourse(course2);
            });

            expect(result.current.selectedCourse?.id).toBe(2);
        });

        it('should allow changing installment plan', () => {
            const { result } = renderHook(() => useEnrollment(), {
                wrapper: EnrollmentProvider,
            });

            const plan2: InstallmentPlan = {
                id: 2,
                installments: 24,
                installmentValue: 250.00,
                totalPrice: 6000.00,
            };

            act(() => {
                result.current.setSelectedInstallmentPlan(mockInstallmentPlan);
            });

            expect(result.current.selectedInstallmentPlan?.installments).toBe(12);

            act(() => {
                result.current.setSelectedInstallmentPlan(plan2);
            });

            expect(result.current.selectedInstallmentPlan?.installments).toBe(24);
        });
    });

    describe('useEnrollment', () => {
        it('should throw error when used outside provider', () => {
            expect(() => {
                renderHook(() => useEnrollment());
            }).toThrow('useEnrollment deve ser usado dentro de um EnrollmentProvider');
        });
    });
});
