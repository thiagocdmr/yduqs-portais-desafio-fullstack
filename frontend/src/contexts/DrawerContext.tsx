import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import type { Course } from "../types/course";

interface DrawerContextType {
    isOpen: boolean;
    selectedCourse: Course | null;
    openDrawer: (course: Course) => void;
    closeDrawer: () => void;
}

const DrawerContext = createContext<DrawerContextType | undefined>(undefined);

export function DrawerProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

    const openDrawer = (course: Course) => {
        setSelectedCourse(course);
        setIsOpen(true);
    };

    const closeDrawer = () => {
        setIsOpen(false);
        setTimeout(() => setSelectedCourse(null), 300);
    };

    const value = {
        isOpen,
        selectedCourse,
        openDrawer,
        closeDrawer,
    };

    return (
        <DrawerContext.Provider value={value}>
            {children}
        </DrawerContext.Provider>
    );
}

export function useDrawer() {
    const context = useContext(DrawerContext);
    if (context === undefined) {
        throw new Error("useDrawer deve ser usado dentro de um DrawerProvider");
    }
    return context;
}
