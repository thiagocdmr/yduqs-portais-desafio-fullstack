import { Box, Typography, Button } from "@mui/material";
import InfoOutlineIcon from "@mui/icons-material/InfoOutline";
import { useDrawer } from "../contexts/DrawerContext";
import type { Course } from "../types/course";

const typographyStyles = {
    header: {
        fontFamily: "Inter",
        fontWeight: "500",
        fontSize: "16px",
        lineHeight: "135%",
        color: "white",
    },
    priceLabel: {
        fontFamily: "Inter",
        fontWeight: "500",
        fontSize: "16px",
        lineHeight: "115%",
        color: "white",
    },
    priceLabelStrikethrough: {
        fontFamily: "Inter",
        fontWeight: "500",
        fontSize: "16px",
        lineHeight: "115%",
        color: "white",
        textDecoration: "line-through",
    },
    installments: {
        fontFamily: "Inter",
        fontWeight: "500",
        fontSize: "16px",
        lineHeight: "135%",
        color: "white",
    },
    priceMain: {
        fontFamily: "Inter",
        fontWeight: "600",
        fontSize: "40px",
        lineHeight: "115%",
        color: "white",
    },
    priceSecondary: {
        fontFamily: "Inter",
        fontWeight: "500",
        fontSize: "14px",
        lineHeight: "150%",
        color: "white",
    },
    description: {
        fontFamily: "Inter",
        fontWeight: "400",
        fontSize: "14px",
        lineHeight: "133%",
        color: "white",
    },
    locationTitle: {
        fontFamily: "Inter",
        fontWeight: "500",
        fontSize: "14px",
        lineHeight: "135%",
        marginBottom: "4px",
    },
    locationAddress: {
        fontFamily: "Inter",
        fontWeight: "400",
        fontSize: "14px",
        lineHeight: "115%",
    },
};

interface CourseCardProps {
    course: Course;
}

export default function CourseCard({ course }: CourseCardProps) {
    const { openDrawer } = useDrawer();

    const handleAdvance = () => {
        openDrawer(course);
    };
    return (
        <Box sx={{ width: "100%", maxWidth: { xs: "100%", md: "381px" } }}>
            <Box
                sx={{
                    borderTopLeftRadius: "8px",
                    borderTopRightRadius: "8px",
                    backgroundColor: "#001F66",
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    py: "8px",
                    px: "16px",
                    gap: "8px",
                }}
            >
                <Typography sx={typographyStyles.header}>
                    {course.modality}
                </Typography>
                {course.type === "Presencial" && course.period && (
                    <>
                        <Typography sx={typographyStyles.header}>|</Typography>
                        <Typography sx={typographyStyles.header}>
                            {course.period}
                        </Typography>
                    </>
                )}
            </Box>

            <Box
                sx={{
                    backgroundColor: "#144BC8",
                    pt: "24px",
                    pb: "16px",
                    px: "16px",
                }}
            >
                {course.type === "Presencial" ? (
                    <>
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                mb: "4px",
                                gap: "4px",
                            }}
                        >
                            <Typography sx={typographyStyles.priceLabel}>
                                De
                            </Typography>
                            <Typography
                                sx={typographyStyles.priceLabelStrikethrough}
                            >
                                R$ {"  "}
                                {(course.originalPrice || 0).toLocaleString(
                                    "pt-BR",
                                    {
                                        minimumFractionDigits: 2,
                                    }
                                )}
                            </Typography>
                            <Typography sx={typographyStyles.priceLabel}>
                                por até
                            </Typography>
                        </Box>
                        <Box>
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "baseline",
                                    gap: "4px",
                                }}
                            >
                                <Typography sx={typographyStyles.installments}>
                                    {course.installments}x
                                </Typography>
                                <Typography sx={typographyStyles.priceMain}>
                                    R${" "}
                                    {(
                                        course.installmentPrice || 0
                                    ).toLocaleString("pt-BR", {
                                        minimumFractionDigits: 2,
                                    })}
                                </Typography>
                            </Box>
                        </Box>
                        <Box sx={{ mb: "24px" }}>
                            <Typography sx={typographyStyles.priceSecondary}>
                                à vista R${" "}
                                {(course.cashPrice || 0).toLocaleString(
                                    "pt-BR",
                                    {
                                        minimumFractionDigits: 2,
                                    }
                                )}
                            </Typography>
                        </Box>
                    </>
                ) : (
                    <Box sx={{ mb: "24px" }}>
                        <InfoOutlineIcon
                            sx={{
                                width: "21.5px",
                                height: "21.5px",
                                color: "white",
                            }}
                        />
                        <Typography
                            sx={{ ...typographyStyles.description, pt: "8px" }}
                        >
                            {course.description}
                        </Typography>
                    </Box>
                )}

                <Button
                    variant="contained"
                    fullWidth
                    onClick={handleAdvance}
                    sx={{
                        width: "100%",
                        height: "48px",
                        backgroundColor: "#EE325D",
                        color: "white",
                        fontFamily: "Inter",
                        fontWeight: "500",
                        fontSize: "16px",
                        textTransform: "none",
                        lineHeight: "100%",
                        borderRadius: "8px",
                        "&:hover": {
                            backgroundColor: "#DC2626",
                        },
                    }}
                >
                    Avançar
                </Button>
            </Box>

            <Box
                sx={{
                    p: "16px",
                    border: "1px solid #144BC8",
                    borderBottomLeftRadius: "8px",
                    borderBottomRightRadius: "8px",
                }}
            >
                <Typography
                    sx={{
                        ...typographyStyles.locationTitle,
                        color: "#121212",
                        textTransform: "uppercase",
                    }}
                >
                    {course.location.city} - {course.location.unit}
                </Typography>
                <Typography
                    sx={{
                        ...typographyStyles.locationAddress,
                        color: "#3D3D3D",
                        textTransform: "uppercase",
                    }}
                >
                    {course.location.address}
                </Typography>
            </Box>
        </Box>
    );
}
