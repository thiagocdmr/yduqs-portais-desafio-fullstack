import { api } from './api';
import type { Course } from '../types/course';
import type { InstallmentPlan } from '../types/installmentPlan';

export const courseService = {
  async getAll(): Promise<Course[]> {
    const response = await api.get<Course[]>('/courses');
    return response.data;
  },

  async getInstallmentPlans(courseId: number): Promise<InstallmentPlan[]> {
    const response = await api.get<InstallmentPlan[]>(`/courses/${courseId}/installment-plans`);
    return response.data;
  },
};
