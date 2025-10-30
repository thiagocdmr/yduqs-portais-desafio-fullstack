import { api } from './api';
import type { Course } from '../types/course';

export const courseService = {
  async getAll(): Promise<Course[]> {
    const response = await api.get<Course[]>('/courses');
    return response.data;
  },
};
