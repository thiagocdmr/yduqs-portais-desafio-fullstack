import { Box, Typography, CircularProgress, Alert } from "@mui/material";
import CourseCard from "./CourseCard";
import { useCourses } from "../contexts/CourseContext";

export default function CourseGrid() {
    const { courses, loading, error } = useCourses();

    if (loading) {
        return (
            <Box
                component="section"
                sx={{
                    maxWidth: "1366px",
                    mx: "auto",
                    pt: "32px",
                    pb: "56px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box
                component="section"
                sx={{ maxWidth: "1366px", mx: "auto", pt: "32px", pb: "56px" }}
            >
                <Alert severity="error">{error}</Alert>
            </Box>
        );
    }

    return (
        <Box
            component="section"
            sx={{ maxWidth: "1366px", mx: "auto", pt: "32px", pb: "56px" }}
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
                {courses.length}{" "}
                {courses.length === 1
                    ? "opção encontrada"
                    : "opções encontradas"}
            </Typography>
            <Box
                sx={{
                    display: "flex",
                    mt: "16px",
                    gap: "24px",
                    flexWrap: "wrap",
                }}
            >
                {courses.map((course) => (
                    <CourseCard key={course.id} course={course} />
                ))}
            </Box>
        </Box>
    );
}
