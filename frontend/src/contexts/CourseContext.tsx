import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { Course } from "../types/course";
import { courseService } from "../services/courseService";

interface CourseContextType {
    courses: Course[];
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

const CourseContext = createContext<CourseContextType | undefined>(undefined);

export function CourseProvider({ children }: { children: ReactNode }) {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchCourses = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await courseService.getAll();
            setCourses(data);
        } catch (err) {
            const errorMessage =
                err instanceof Error
                    ? err.message
                    : "Erro desconhecido ao buscar cursos";
            setError(errorMessage);
            console.error("Erro ao buscar cursos:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    const value = {
        courses,
        loading,
        error,
        refetch: fetchCourses,
    };

    return (
        <CourseContext.Provider value={value}>
            {children}
        </CourseContext.Provider>
    );
}

export function useCourses() {
    const context = useContext(CourseContext);
    if (context === undefined) {
        throw new Error(
            "useCourses deve ser usado dentro de um CourseProvider"
        );
    }
    return context;
}
