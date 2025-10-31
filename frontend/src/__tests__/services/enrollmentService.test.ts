import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { enrollmentService, type CreateEnrollmentRequest, type EnrollmentResponse } from '../../services/enrollmentService';
import { api } from '../../services/api';

// Mock do axios
vi.mock('../../services/api', () => ({
    api: {
        post: vi.fn(),
    },
}));

describe('enrollmentService - Backend Integration', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('createEnrollment', () => {
        const validEnrollmentRequest: CreateEnrollmentRequest = {
            student: {
                fullName: 'João Silva Santos',
                cpf: '123.456.789-09',
                birthDate: '1990-01-15',
                email: 'joao.silva@example.com',
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

        it('should call correct endpoint with POST method', async () => {
            const mockResponse: EnrollmentResponse = {
                id: 1,
                courseId: 1,
                installments: 12,
                installmentValue: 450.00,
                totalPrice: 5400.00,
                createdAt: '2024-01-01T00:00:00.000Z',
                student: {
                    id: 1,
                    ...validEnrollmentRequest.student,
                    createdAt: '2024-01-01T00:00:00.000Z',
                },
            };

            vi.mocked(api.post).mockResolvedValue({ data: mockResponse });

            await enrollmentService.createEnrollment(validEnrollmentRequest);

            expect(api.post).toHaveBeenCalledWith('/enrollments', validEnrollmentRequest);
            expect(api.post).toHaveBeenCalledTimes(1);
        });

        it('should send student data with correct structure', async () => {
            const mockResponse: EnrollmentResponse = {
                id: 1,
                courseId: 1,
                createdAt: '2024-01-01T00:00:00.000Z',
                student: {
                    id: 1,
                    ...validEnrollmentRequest.student,
                    createdAt: '2024-01-01T00:00:00.000Z',
                },
            };

            vi.mocked(api.post).mockResolvedValue({ data: mockResponse });

            await enrollmentService.createEnrollment(validEnrollmentRequest);

            const callArgs = vi.mocked(api.post).mock.calls[0];
            const sentData = callArgs[1] as CreateEnrollmentRequest;

            // Verifica estrutura dos dados do estudante
            expect(sentData.student).toHaveProperty('fullName');
            expect(sentData.student).toHaveProperty('cpf');
            expect(sentData.student).toHaveProperty('birthDate');
            expect(sentData.student).toHaveProperty('email');
            expect(sentData.student).toHaveProperty('phone');
            expect(sentData.student).toHaveProperty('highSchoolCompletionYear');
            expect(sentData.student).toHaveProperty('agreeToTerms');
            expect(sentData.student).toHaveProperty('receiveWhatsappNotifications');

            // Verifica tipos dos dados
            expect(typeof sentData.student.fullName).toBe('string');
            expect(typeof sentData.student.cpf).toBe('string');
            expect(typeof sentData.student.birthDate).toBe('string');
            expect(typeof sentData.student.email).toBe('string');
            expect(typeof sentData.student.phone).toBe('string');
            expect(typeof sentData.student.highSchoolCompletionYear).toBe('number');
            expect(typeof sentData.student.agreeToTerms).toBe('boolean');
            expect(typeof sentData.student.receiveWhatsappNotifications).toBe('boolean');
        });

        it('should send payment info with correct structure', async () => {
            const mockResponse: EnrollmentResponse = {
                id: 1,
                courseId: 1,
                installments: 12,
                installmentValue: 450.00,
                totalPrice: 5400.00,
                createdAt: '2024-01-01T00:00:00.000Z',
                student: {
                    id: 1,
                    ...validEnrollmentRequest.student,
                    createdAt: '2024-01-01T00:00:00.000Z',
                },
            };

            vi.mocked(api.post).mockResolvedValue({ data: mockResponse });

            await enrollmentService.createEnrollment(validEnrollmentRequest);

            const callArgs = vi.mocked(api.post).mock.calls[0];
            const sentData = callArgs[1] as CreateEnrollmentRequest;

            // Verifica estrutura do payment info
            expect(sentData.paymentInfo).toHaveProperty('courseId');
            expect(typeof sentData.paymentInfo.courseId).toBe('number');
            expect(sentData.paymentInfo.courseId).toBeGreaterThan(0);

            if (sentData.paymentInfo.installments) {
                expect(typeof sentData.paymentInfo.installments).toBe('number');
                expect(sentData.paymentInfo.installments).toBeGreaterThan(0);
            }

            if (sentData.paymentInfo.installmentValue) {
                expect(typeof sentData.paymentInfo.installmentValue).toBe('number');
                expect(sentData.paymentInfo.installmentValue).toBeGreaterThan(0);
            }

            if (sentData.paymentInfo.totalPrice) {
                expect(typeof sentData.paymentInfo.totalPrice).toBe('number');
                expect(sentData.paymentInfo.totalPrice).toBeGreaterThan(0);
            }
        });

        it('should return enrollment response with correct structure', async () => {
            const mockResponse: EnrollmentResponse = {
                id: 1,
                courseId: 1,
                installments: 12,
                installmentValue: 450.00,
                totalPrice: 5400.00,
                createdAt: '2024-01-01T00:00:00.000Z',
                student: {
                    id: 1,
                    fullName: 'João Silva Santos',
                    cpf: '123.456.789-09',
                    birthDate: '1990-01-15',
                    email: 'joao.silva@example.com',
                    phone: '(11) 98765-4321',
                    highSchoolCompletionYear: 2008,
                    agreeToTerms: true,
                    receiveWhatsappNotifications: true,
                    createdAt: '2024-01-01T00:00:00.000Z',
                },
            };

            vi.mocked(api.post).mockResolvedValue({ data: mockResponse });

            const result = await enrollmentService.createEnrollment(validEnrollmentRequest);

            // Verifica estrutura da resposta
            expect(result).toHaveProperty('id');
            expect(result).toHaveProperty('courseId');
            expect(result).toHaveProperty('createdAt');
            expect(result).toHaveProperty('student');

            // Verifica tipos
            expect(typeof result.id).toBe('number');
            expect(typeof result.courseId).toBe('number');
            expect(typeof result.createdAt).toBe('string');

            // Verifica que IDs foram gerados
            expect(result.id).toBeGreaterThan(0);
            expect(result.student.id).toBeGreaterThan(0);

            // Verifica que timestamps foram criados
            expect(result.createdAt).toBeTruthy();
            expect(result.student.createdAt).toBeTruthy();
        });

        it('should handle EAD course enrollment (without installment info)', async () => {
            const eadEnrollmentRequest: CreateEnrollmentRequest = {
                student: validEnrollmentRequest.student,
                paymentInfo: {
                    courseId: 2,
                },
            };

            const mockResponse: EnrollmentResponse = {
                id: 2,
                courseId: 2,
                createdAt: '2024-01-01T00:00:00.000Z',
                student: {
                    id: 1,
                    ...validEnrollmentRequest.student,
                    createdAt: '2024-01-01T00:00:00.000Z',
                },
            };

            vi.mocked(api.post).mockResolvedValue({ data: mockResponse });

            const result = await enrollmentService.createEnrollment(eadEnrollmentRequest);

            // Verifica que campos opcionais não estão presentes
            expect(result.installments).toBeUndefined();
            expect(result.installmentValue).toBeUndefined();
            expect(result.totalPrice).toBeUndefined();
        });

        it('should validate CPF format in request', async () => {
            const mockResponse: EnrollmentResponse = {
                id: 1,
                courseId: 1,
                createdAt: '2024-01-01T00:00:00.000Z',
                student: {
                    id: 1,
                    ...validEnrollmentRequest.student,
                    createdAt: '2024-01-01T00:00:00.000Z',
                },
            };

            vi.mocked(api.post).mockResolvedValue({ data: mockResponse });

            await enrollmentService.createEnrollment(validEnrollmentRequest);

            const callArgs = vi.mocked(api.post).mock.calls[0];
            const sentData = callArgs[1] as CreateEnrollmentRequest;

            // Verifica formato do CPF
            expect(sentData.student.cpf).toMatch(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/);
        });

        it('should validate email format in request', async () => {
            const mockResponse: EnrollmentResponse = {
                id: 1,
                courseId: 1,
                createdAt: '2024-01-01T00:00:00.000Z',
                student: {
                    id: 1,
                    ...validEnrollmentRequest.student,
                    createdAt: '2024-01-01T00:00:00.000Z',
                },
            };

            vi.mocked(api.post).mockResolvedValue({ data: mockResponse });

            await enrollmentService.createEnrollment(validEnrollmentRequest);

            const callArgs = vi.mocked(api.post).mock.calls[0];
            const sentData = callArgs[1] as CreateEnrollmentRequest;

            // Verifica formato do email
            expect(sentData.student.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
        });

        it('should validate phone format in request', async () => {
            const mockResponse: EnrollmentResponse = {
                id: 1,
                courseId: 1,
                createdAt: '2024-01-01T00:00:00.000Z',
                student: {
                    id: 1,
                    ...validEnrollmentRequest.student,
                    createdAt: '2024-01-01T00:00:00.000Z',
                },
            };

            vi.mocked(api.post).mockResolvedValue({ data: mockResponse });

            await enrollmentService.createEnrollment(validEnrollmentRequest);

            const callArgs = vi.mocked(api.post).mock.calls[0];
            const sentData = callArgs[1] as CreateEnrollmentRequest;

            // Verifica formato do telefone
            expect(sentData.student.phone).toMatch(/^\(\d{2}\)\s\d{5}-\d{4}$/);
        });

        it('should handle validation errors from backend', async () => {
            const validationError = {
                response: {
                    status: 400,
                    data: {
                        message: 'Validation failed',
                        errors: {
                            cpf: 'CPF inválido',
                            email: 'E-mail já cadastrado',
                        },
                    },
                },
            };

            vi.mocked(api.post).mockRejectedValue(validationError);

            await expect(enrollmentService.createEnrollment(validEnrollmentRequest))
                .rejects.toEqual(validationError);
        });

        it('should handle network errors', async () => {
            const networkError = new Error('Network Error');
            vi.mocked(api.post).mockRejectedValue(networkError);

            await expect(enrollmentService.createEnrollment(validEnrollmentRequest))
                .rejects.toThrow('Network Error');
        });

        it('should handle server errors', async () => {
            const serverError = {
                response: {
                    status: 500,
                    data: { message: 'Internal Server Error' },
                },
            };

            vi.mocked(api.post).mockRejectedValue(serverError);

            await expect(enrollmentService.createEnrollment(validEnrollmentRequest))
                .rejects.toEqual(serverError);
        });

        it('should handle timeout errors', async () => {
            const timeoutError = new Error('timeout of 10000ms exceeded');
            vi.mocked(api.post).mockRejectedValue(timeoutError);

            await expect(enrollmentService.createEnrollment(validEnrollmentRequest))
                .rejects.toThrow('timeout');
        });

        it('should ensure agreeToTerms is true', async () => {
            const mockResponse: EnrollmentResponse = {
                id: 1,
                courseId: 1,
                createdAt: '2024-01-01T00:00:00.000Z',
                student: {
                    id: 1,
                    ...validEnrollmentRequest.student,
                    createdAt: '2024-01-01T00:00:00.000Z',
                },
            };

            vi.mocked(api.post).mockResolvedValue({ data: mockResponse });

            await enrollmentService.createEnrollment(validEnrollmentRequest);

            const callArgs = vi.mocked(api.post).mock.calls[0];
            const sentData = callArgs[1] as CreateEnrollmentRequest;

            // Verifica que termos foram aceitos
            expect(sentData.student.agreeToTerms).toBe(true);
        });

        it('should preserve all student data in response', async () => {
            const mockResponse: EnrollmentResponse = {
                id: 1,
                courseId: 1,
                installments: 12,
                installmentValue: 450.00,
                totalPrice: 5400.00,
                createdAt: '2024-01-01T00:00:00.000Z',
                student: {
                    id: 1,
                    ...validEnrollmentRequest.student,
                    createdAt: '2024-01-01T00:00:00.000Z',
                },
            };

            vi.mocked(api.post).mockResolvedValue({ data: mockResponse });

            const result = await enrollmentService.createEnrollment(validEnrollmentRequest);

            // Verifica que todos os dados do estudante foram preservados
            expect(result.student.fullName).toBe(validEnrollmentRequest.student.fullName);
            expect(result.student.cpf).toBe(validEnrollmentRequest.student.cpf);
            expect(result.student.birthDate).toBe(validEnrollmentRequest.student.birthDate);
            expect(result.student.email).toBe(validEnrollmentRequest.student.email);
            expect(result.student.phone).toBe(validEnrollmentRequest.student.phone);
            expect(result.student.highSchoolCompletionYear).toBe(validEnrollmentRequest.student.highSchoolCompletionYear);
            expect(result.student.agreeToTerms).toBe(validEnrollmentRequest.student.agreeToTerms);
            expect(result.student.receiveWhatsappNotifications).toBe(validEnrollmentRequest.student.receiveWhatsappNotifications);
        });
    });
});
