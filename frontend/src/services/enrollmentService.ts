import { api } from "./api";

export interface StudentData {
    fullName: string;
    cpf: string;
    birthDate: string;
    email: string;
    phone: string;
    highSchoolCompletionYear: number;
    agreeToTerms: boolean;
    receiveWhatsappNotifications: boolean;
}

export interface PaymentInfo {
    courseId: number;
    installments?: number;
    installmentValue?: number;
    totalPrice?: number;
}

export interface CreateEnrollmentRequest {
    student: StudentData;
    paymentInfo: PaymentInfo;
}

export interface EnrollmentResponse {
    id: number;
    courseId: number;
    installments?: number;
    installmentValue?: number;
    totalPrice?: number;
    createdAt: string;
    student: {
        id: number;
        fullName: string;
        cpf: string;
        birthDate: string;
        email: string;
        phone: string;
        highSchoolCompletionYear: number;
        agreeToTerms: boolean;
        receiveWhatsappNotifications: boolean;
        createdAt: string;
    };
}

export const enrollmentService = {
    async createEnrollment(data: CreateEnrollmentRequest): Promise<EnrollmentResponse> {
        const response = await api.post<EnrollmentResponse>("/enrollments", data);
        return response.data;
    },
};
