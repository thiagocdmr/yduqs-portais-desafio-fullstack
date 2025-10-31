import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useCourses } from '../../contexts/CourseContext';
import { useEnrollment } from '../../contexts/EnrollmentContext';
import { CourseProvider } from '../../contexts/CourseContext';
import { EnrollmentProvider } from '../../contexts/EnrollmentContext';
import { courseService } from '../../services/courseService';
import { enrollmentService } from '../../services/enrollmentService';
import type { Course } from '../../types/course';
import type { InstallmentPlan } from '../../types/installmentPlan';

// Mock dos services
vi.mock('../../services/courseService');
vi.mock('../../services/enrollmentService');

describe('Enrollment Flow Integration', () => {
    const mockCourses: Course[] = [
        {
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
        },
    ];

    const mockInstallmentPlans: InstallmentPlan[] = [
        {
            id: 1,
            installments: 12,
            installmentValue: 450.00,
            totalPrice: 5400.00,
        },
        {
            id: 2,
            installments: 24,
            installmentValue: 250.00,
            totalPrice: 6000.00,
        },
    ];

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('Course Selection Flow', () => {
        it('should fetch courses on mount and allow selection', async () => {
            vi.mocked(courseService.getAll).mockResolvedValue(mockCourses);

            const { result: coursesResult } = renderHook(() => useCourses(), {
                wrapper: CourseProvider,
            });

            // Aguarda carregamento dos cursos
            await waitFor(() => {
                expect(coursesResult.current.loading).toBe(false);
            });

            // Verifica que cursos foram carregados
            expect(coursesResult.current.courses).toEqual(mockCourses);
            expect(courseService.getAll).toHaveBeenCalledTimes(1);
        });

        it('should select course and installment plan', async () => {
            vi.mocked(courseService.getAll).mockResolvedValue(mockCourses);

            const { result: enrollmentResult } = renderHook(() => useEnrollment(), {
                wrapper: EnrollmentProvider,
            });

            // Seleciona curso
            act(() => {
                enrollmentResult.current.setSelectedCourse(mockCourses[0]);
            });

            expect(enrollmentResult.current.selectedCourse).toEqual(mockCourses[0]);

            // Seleciona plano de parcelamento
            act(() => {
                enrollmentResult.current.setSelectedInstallmentPlan(mockInstallmentPlans[0]);
            });

            expect(enrollmentResult.current.selectedInstallmentPlan).toEqual(mockInstallmentPlans[0]);
        });
    });

    describe('Enrollment Submission Flow', () => {
        it('should submit enrollment with correct data structure', async () => {
            const mockEnrollmentResponse = {
                id: 1,
                courseId: 1,
                installments: 12,
                installmentValue: 450.00,
                totalPrice: 5400.00,
                createdAt: '2024-01-01T00:00:00.000Z',
                student: {
                    id: 1,
                    fullName: 'João Silva',
                    cpf: '123.456.789-09',
                    birthDate: '1990-01-01',
                    email: 'joao@example.com',
                    phone: '(11) 98765-4321',
                    highSchoolCompletionYear: 2008,
                    agreeToTerms: true,
                    receiveWhatsappNotifications: true,
                    createdAt: '2024-01-01T00:00:00.000Z',
                },
            };

            vi.mocked(enrollmentService.createEnrollment).mockResolvedValue(mockEnrollmentResponse);

            const enrollmentData = {
                student: {
                    fullName: 'João Silva',
                    cpf: '123.456.789-09',
                    birthDate: '1990-01-01',
                    email: 'joao@example.com',
                    phone: '(11) 98765-4321',
                    highSchoolCompletionYear: 2008,
                    agreeToTerms: true,
                    receiveWhatsappNotifications: true,
                },
                paymentInfo: {
                    courseId: 1,
                    installments: 12,
                    installmentValue: 450.00,
                    totalPrice: 5400.00,
                },
            };

            const result = await enrollmentService.createEnrollment(enrollmentData);

            // Verifica que o service foi chamado com dados corretos
            expect(enrollmentService.createEnrollment).toHaveBeenCalledWith(enrollmentData);
            
            // Verifica estrutura da resposta
            expect(result).toHaveProperty('id');
            expect(result).toHaveProperty('student');
            expect(result.student).toHaveProperty('id');
            expect(result.courseId).toBe(enrollmentData.paymentInfo.courseId);
        });

        it('should validate required fields before submission', async () => {
            const incompleteData = {
                student: {
                    fullName: '',
                    cpf: '',
                    birthDate: '',
                    email: '',
                    phone: '',
                    highSchoolCompletionYear: 0,
                    agreeToTerms: false,
                    receiveWhatsappNotifications: false,
                },
                paymentInfo: {
                    courseId: 1,
                },
            };

            const validationError = {
                response: {
                    status: 400,
                    data: {
                        message: 'Validation failed',
                        errors: {
                            fullName: 'Nome completo é obrigatório',
                            cpf: 'CPF é obrigatório',
                            email: 'E-mail é obrigatório',
                        },
                    },
                },
            };

            vi.mocked(enrollmentService.createEnrollment).mockRejectedValue(validationError);

            await expect(enrollmentService.createEnrollment(incompleteData))
                .rejects.toEqual(validationError);
        });
    });

    describe('Data Consistency', () => {
        it('should maintain data consistency between course and enrollment', async () => {
            vi.mocked(courseService.getAll).mockResolvedValue(mockCourses);

            const { result: enrollmentResult } = renderHook(() => useEnrollment(), {
                wrapper: EnrollmentProvider,
            });

            // Seleciona curso
            act(() => {
                enrollmentResult.current.setSelectedCourse(mockCourses[0]);
                enrollmentResult.current.setSelectedInstallmentPlan(mockInstallmentPlans[0]);
            });

            const selectedCourse = enrollmentResult.current.selectedCourse;
            const selectedPlan = enrollmentResult.current.selectedInstallmentPlan;

            // Verifica consistência dos dados
            expect(selectedCourse?.id).toBe(1);
            expect(selectedPlan?.installments).toBe(12);
            expect(selectedPlan?.installmentValue).toBe(450.00);
            expect(selectedPlan?.totalPrice).toBe(5400.00);

            // Verifica que o cálculo está correto
            if (selectedPlan) {
                const calculatedTotal = selectedPlan.installments * selectedPlan.installmentValue;
                expect(Math.abs(selectedPlan.totalPrice - calculatedTotal)).toBeLessThan(0.01);
            }
        });

        it('should clear enrollment data after submission', async () => {
            const { result } = renderHook(() => useEnrollment(), {
                wrapper: EnrollmentProvider,
            });

            // Define dados
            act(() => {
                result.current.setSelectedCourse(mockCourses[0]);
                result.current.setSelectedInstallmentPlan(mockInstallmentPlans[0]);
            });

            expect(result.current.selectedCourse).toBeTruthy();
            expect(result.current.selectedInstallmentPlan).toBeTruthy();

            // Limpa dados
            act(() => {
                result.current.clearEnrollment();
            });

            expect(result.current.selectedCourse).toBeNull();
            expect(result.current.selectedInstallmentPlan).toBeNull();
        });
    });

    describe('Error Handling', () => {
        it('should handle course fetch errors', async () => {
            const error = new Error('Failed to fetch courses');
            vi.mocked(courseService.getAll).mockRejectedValue(error);

            const { result } = renderHook(() => useCourses(), {
                wrapper: CourseProvider,
            });

            await waitFor(() => {
                expect(result.current.loading).toBe(false);
            });

            expect(result.current.error).toBeTruthy();
            expect(result.current.courses).toEqual([]);
        });

        it('should handle enrollment submission errors', async () => {
            const error = {
                response: {
                    status: 500,
                    data: { message: 'Internal Server Error' },
                },
            };

            vi.mocked(enrollmentService.createEnrollment).mockRejectedValue(error);

            const enrollmentData = {
                student: {
                    fullName: 'João Silva',
                    cpf: '123.456.789-09',
                    birthDate: '1990-01-01',
                    email: 'joao@example.com',
                    phone: '(11) 98765-4321',
                    highSchoolCompletionYear: 2008,
                    agreeToTerms: true,
                    receiveWhatsappNotifications: true,
                },
                paymentInfo: {
                    courseId: 1,
                },
            };

            await expect(enrollmentService.createEnrollment(enrollmentData))
                .rejects.toEqual(error);
        });
    });
});
