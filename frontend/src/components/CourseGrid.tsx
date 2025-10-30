import { Box, Typography, CircularProgress, Alert } from "@mui/material";
import CourseCard from "./CourseCard";
import { useCourses } from "../contexts/CourseContext";

export default function CourseGrid() {
    const { courses, loading, error } = useCourses();

    if (loading) {
        return (
            <Box
                component="section"
                className="max-w-[1366px] mx-auto pt-8 pb-14 flex justify-center items-center"
            >
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box
                component="section"
                className="max-w-[1366px] mx-auto pt-8 pb-14"
            >
                <Alert severity="error">{error}</Alert>
            </Box>
        );
    }

    return (
        <Box
            component="section"
            className="max-w-[1366px] mx-auto pt-8 pb-14"
        >
            <Typography
                sx={{
                    fontFamily: "Inter",
                    fontWeight: "400",
                    fontSize: "14px",
                    lineHeight: "133%",
                    letterSpacing: "0%",
                    color: "neutral-dark-pure",
                }}
            >
                {courses.length} {courses.length === 1 ? 'opção encontrada' : 'opções encontradas'}
            </Typography>
            <Box className="flex mt-4 gap-6 flex-wrap">
                {courses.map((course) => (
                    <CourseCard
                        key={course.id}
                        modality={course.modality}
                        shift={course.period || 'N/A'}
                        originalPrice={course.originalPrice || 0}
                        currentPrice={course.installmentPrice || 0}
                        installments={course.installments || 0}
                        installmentValue={course.cashPrice || 0}
                        location={`${course.location.city} - ${course.location.unit}`}
                        address={course.location.address}
                    />
                ))}
            </Box>
        </Box>
    );
}
