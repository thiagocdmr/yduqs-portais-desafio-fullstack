import { Box, Typography } from "@mui/material";
import CourseCard from "./CourseCard";

export default function CourseGrid() {
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
                2 opções encontradas
            </Typography>
            <Box className="flex mt-4 gap-6">
                <CourseCard
                    modality="Modalidade"
                    shift="Turno"
                    originalPrice={100}
                    currentPrice={100}
                    installments={12}
                    installmentValue={100}
                    location="Localização"
                    address="Endereço"
                />
                <CourseCard
                    modality="Modalidade"
                    shift="Turno"
                    originalPrice={100}
                    currentPrice={100}
                    installments={12}
                    installmentValue={100}
                    location="Localização"
                    address="Endereço"
                />
            </Box>
        </Box>
    );
}
