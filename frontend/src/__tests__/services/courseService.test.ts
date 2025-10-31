import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { courseService } from '../../services/courseService';
import { api } from '../../services/api';
import type { Course } from '../../types/course';
import type { InstallmentPlan } from '../../types/installmentPlan';

// Mock do axios
vi.mock('../../services/api', () => ({
    api: {
        get: vi.fn(),
    },
}));

describe('courseService - Backend Integration', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('getAll', () => {
        it('should call correct endpoint', async () => {
            const mockCourses: Course[] = [];
            vi.mocked(api.get).mockResolvedValue({ data: mockCourses });

            await courseService.getAll();

            expect(api.get).toHaveBeenCalledWith('/courses');
            expect(api.get).toHaveBeenCalledTimes(1);
        });

        it('should return courses with correct structure', async () => {
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

            vi.mocked(api.get).mockResolvedValue({ data: mockCourses });

            const result = await courseService.getAll();

            // Verifica estrutura do retorno
            expect(result).toBeInstanceOf(Array);
            expect(result).toHaveLength(1);
            
            // Verifica campos obrigatórios
            expect(result[0]).toHaveProperty('id');
            expect(result[0]).toHaveProperty('modality');
            expect(result[0]).toHaveProperty('type');
            expect(result[0]).toHaveProperty('location');
            
            // Verifica tipos dos campos
            expect(typeof result[0].id).toBe('number');
            expect(typeof result[0].modality).toBe('string');
            expect(typeof result[0].type).toBe('string');
            
            // Verifica estrutura de location
            expect(result[0].location).toHaveProperty('city');
            expect(result[0].location).toHaveProperty('unit');
            expect(result[0].location).toHaveProperty('address');
        });

        it('should handle presencial course data correctly', async () => {
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

            vi.mocked(api.get).mockResolvedValue({ data: mockCourses });

            const result = await courseService.getAll();
            const course = result[0];

            // Verifica campos específicos de curso presencial
            expect(course.type).toBe('Presencial');
            expect(course.period).toBeTruthy();
            expect(course.originalPrice).toBeGreaterThan(0);
            expect(course.installmentPrice).toBeGreaterThan(0);
            expect(course.installments).toBeGreaterThan(0);
            expect(course.cashPrice).toBeGreaterThan(0);
            expect(course.description).toBeNull();
        });

        it('should handle EAD course data correctly', async () => {
            const mockCourses: Course[] = [
                {
                    id: 2,
                    modality: 'Graduação EAD',
                    period: null,
                    originalPrice: null,
                    installmentPrice: null,
                    installments: null,
                    cashPrice: null,
                    description: 'Curso 100% online',
                    type: 'EAD',
                    location: {
                        city: 'São Paulo',
                        unit: 'EAD',
                        address: 'Online',
                    },
                },
            ];

            vi.mocked(api.get).mockResolvedValue({ data: mockCourses });

            const result = await courseService.getAll();
            const course = result[0];

            // Verifica campos específicos de curso EAD
            expect(course.type).toBe('EAD');
            expect(course.period).toBeNull();
            expect(course.originalPrice).toBeNull();
            expect(course.installmentPrice).toBeNull();
            expect(course.installments).toBeNull();
            expect(course.cashPrice).toBeNull();
            expect(course.description).toBeTruthy();
            expect(typeof course.description).toBe('string');
        });

        it('should handle empty array response', async () => {
            vi.mocked(api.get).mockResolvedValue({ data: [] });

            const result = await courseService.getAll();

            expect(result).toEqual([]);
            expect(result).toHaveLength(0);
        });

        it('should handle network errors', async () => {
            const networkError = new Error('Network Error');
            vi.mocked(api.get).mockRejectedValue(networkError);

            await expect(courseService.getAll()).rejects.toThrow('Network Error');
        });

        it('should handle API errors with status code', async () => {
            const apiError = {
                response: {
                    status: 500,
                    data: { message: 'Internal Server Error' },
                },
            };
            vi.mocked(api.get).mockRejectedValue(apiError);

            await expect(courseService.getAll()).rejects.toEqual(apiError);
        });

        it('should handle timeout errors', async () => {
            const timeoutError = new Error('timeout of 10000ms exceeded');
            vi.mocked(api.get).mockRejectedValue(timeoutError);

            await expect(courseService.getAll()).rejects.toThrow('timeout');
        });
    });

    describe('getInstallmentPlans', () => {
        it('should call correct endpoint with courseId', async () => {
            const courseId = 1;
            const mockPlans: InstallmentPlan[] = [];
            vi.mocked(api.get).mockResolvedValue({ data: mockPlans });

            await courseService.getInstallmentPlans(courseId);

            expect(api.get).toHaveBeenCalledWith(`/courses/${courseId}/installment-plans`);
            expect(api.get).toHaveBeenCalledTimes(1);
        });

        it('should return installment plans with correct structure', async () => {
            const courseId = 1;
            const mockPlans: InstallmentPlan[] = [
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

            vi.mocked(api.get).mockResolvedValue({ data: mockPlans });

            const result = await courseService.getInstallmentPlans(courseId);

            // Verifica estrutura do retorno
            expect(result).toBeInstanceOf(Array);
            expect(result).toHaveLength(2);
            
            // Verifica campos obrigatórios
            result.forEach(plan => {
                expect(plan).toHaveProperty('id');
                expect(plan).toHaveProperty('installments');
                expect(plan).toHaveProperty('installmentValue');
                expect(plan).toHaveProperty('totalPrice');
                
                // Verifica tipos
                expect(typeof plan.id).toBe('number');
                expect(typeof plan.installments).toBe('number');
                expect(typeof plan.installmentValue).toBe('number');
                expect(typeof plan.totalPrice).toBe('number');
                
                // Verifica valores positivos
                expect(plan.id).toBeGreaterThan(0);
                expect(plan.installments).toBeGreaterThan(0);
                expect(plan.installmentValue).toBeGreaterThan(0);
                expect(plan.totalPrice).toBeGreaterThan(0);
            });
        });

        it('should validate installment plan calculations', async () => {
            const courseId = 1;
            const mockPlans: InstallmentPlan[] = [
                {
                    id: 1,
                    installments: 12,
                    installmentValue: 450.00,
                    totalPrice: 5400.00,
                },
            ];

            vi.mocked(api.get).mockResolvedValue({ data: mockPlans });

            const result = await courseService.getInstallmentPlans(courseId);
            const plan = result[0];

            // Verifica se o cálculo está correto (com margem de erro para arredondamento)
            const expectedTotal = plan.installments * plan.installmentValue;
            expect(Math.abs(plan.totalPrice - expectedTotal)).toBeLessThan(0.01);
        });

        it('should handle different courseIds', async () => {
            const courseIds = [1, 2, 999];
            
            for (const courseId of courseIds) {
                vi.mocked(api.get).mockResolvedValue({ data: [] });
                
                await courseService.getInstallmentPlans(courseId);
                
                expect(api.get).toHaveBeenCalledWith(`/courses/${courseId}/installment-plans`);
            }
        });

        it('should handle empty plans array', async () => {
            const courseId = 1;
            vi.mocked(api.get).mockResolvedValue({ data: [] });

            const result = await courseService.getInstallmentPlans(courseId);

            expect(result).toEqual([]);
            expect(result).toHaveLength(0);
        });

        it('should handle 404 error for non-existent course', async () => {
            const courseId = 999;
            const notFoundError = {
                response: {
                    status: 404,
                    data: { message: 'Course not found' },
                },
            };
            vi.mocked(api.get).mockRejectedValue(notFoundError);

            await expect(courseService.getInstallmentPlans(courseId)).rejects.toEqual(notFoundError);
        });

        it('should handle network errors', async () => {
            const courseId = 1;
            const networkError = new Error('Network Error');
            vi.mocked(api.get).mockRejectedValue(networkError);

            await expect(courseService.getInstallmentPlans(courseId)).rejects.toThrow('Network Error');
        });
    });
});
