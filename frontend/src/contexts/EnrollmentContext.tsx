import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import type { Course } from "../types/course";
import type { InstallmentPlan } from "../types/installmentPlan";

interface EnrollmentContextType {
    selectedCourse: Course | null;
    selectedInstallmentPlan: InstallmentPlan | null;
    setSelectedCourse: (course: Course | null) => void;
    setSelectedInstallmentPlan: (plan: InstallmentPlan | null) => void;
    clearEnrollment: () => void;
}

const EnrollmentContext = createContext<EnrollmentContextType | undefined>(
    undefined
);

export function EnrollmentProvider({ children }: { children: ReactNode }) {
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
    const [selectedInstallmentPlan, setSelectedInstallmentPlan] =
        useState<InstallmentPlan | null>(null);

    const clearEnrollment = () => {
        setSelectedCourse(null);
        setSelectedInstallmentPlan(null);
    };

    const value = {
        selectedCourse,
        selectedInstallmentPlan,
        setSelectedCourse,
        setSelectedInstallmentPlan,
        clearEnrollment,
    };

    return (
        <EnrollmentContext.Provider value={value}>
            {children}
        </EnrollmentContext.Provider>
    );
}

export function useEnrollment() {
    const context = useContext(EnrollmentContext);
    if (context === undefined) {
        throw new Error(
            "useEnrollment deve ser usado dentro de um EnrollmentProvider"
        );
    }
    return context;
}
