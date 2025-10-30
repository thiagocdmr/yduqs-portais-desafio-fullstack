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
        <Box className="w-full max-w-[381px]">
            <Box className="w-full rounded-t-lg bg-primary-action-low flex flex-row items-center align-center py-2 px-4 gap-x-2">
                <Typography sx={typographyStyles.header}>{course.modality}</Typography>
                {course.type === "Presencial" && course.period && (
                    <>
                        <Typography sx={typographyStyles.header}>|</Typography>
                        <Typography sx={typographyStyles.header}>
                            {course.period}
                        </Typography>
                    </>
                )}
            </Box>

            <Box className="w-full bg-primary-action-pure pt-6 pb-4 px-4">
                {course.type === "Presencial" ? (
                    <>
                        <Box className="flex items-center mb-2 gap-x-1">
                            <Typography sx={typographyStyles.priceLabel}>
                                De
                            </Typography>
                            <Typography
                                sx={typographyStyles.priceLabelStrikethrough}
                            >
                                R$ {"  "}
                                {(course.originalPrice || 0).toLocaleString("pt-BR", {
                                    minimumFractionDigits: 2,
                                })}
                            </Typography>
                            <Typography sx={typographyStyles.priceLabel}>
                                por até
                            </Typography>
                        </Box>
                        <Box>
                            <Box className="flex items-baseline gap-1">
                                <Typography sx={typographyStyles.installments}>
                                    {course.installments}x
                                </Typography>
                                <Typography sx={typographyStyles.priceMain}>
                                    R${" "}
                                    {(course.installmentPrice || 0).toLocaleString("pt-BR", {
                                        minimumFractionDigits: 2,
                                    })}
                                </Typography>
                            </Box>
                        </Box>
                        <Box className="mb-6">
                            <Typography sx={typographyStyles.priceSecondary}>
                                à vista R${" "}
                                {(course.cashPrice || 0).toLocaleString("pt-BR", {
                                    minimumFractionDigits: 2,
                                })}
                            </Typography>
                        </Box>
                    </>
                ) : (
                    <Box className="mb-6">
                        <InfoOutlineIcon
                            sx={{
                                width: "21.5px",
                                height: "21.5px",
                                color: "white",
                            }}
                        />
                        <Typography
                            className="pt-2"
                            sx={typographyStyles.description}
                        >
                            {course.description}
                        </Typography>
                    </Box>
                )}

                <Button
                    variant="contained"
                    fullWidth
                    className="b-4 w-[333px] h-[48px]"
                    onClick={handleAdvance}
                    sx={{
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

            <Box className="px-4 py-6 border border-rounded rounded-b-lg border-primary-action-pure">
                <Typography
                    className="text-neutral-dark-pure uppercase"
                    sx={typographyStyles.locationTitle}
                >
                    {course.location.city} - {course.location.unit}
                </Typography>
                <Typography
                    className="text-neutral-dark-low uppercase"
                    sx={typographyStyles.locationAddress}
                >
                    {course.location.address}
                </Typography>
            </Box>
        </Box>
    );
}
