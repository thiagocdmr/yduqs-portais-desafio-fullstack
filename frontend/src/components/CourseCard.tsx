import { Box, Typography, Button } from "@mui/material";

// Estilos de tipografia padronizados
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
    modality: string;
    shift: string;
    originalPrice: number;
    currentPrice: number;
    installments: number;
    installmentValue: number;
    location: string;
    address: string;
}

export default function CourseCard({
    modality,
    shift,
    originalPrice,
    currentPrice,
    installments,
    installmentValue,
    location,
    address,
}: CourseCardProps) {
    return (
        <Box className="w-full max-w-[381px]">
            <Box className="w-full rounded-t-lg bg-primary-action-low flex flex-row items-center align-center py-2 px-4 gap-x-2">
                <Typography sx={typographyStyles.header}>
                    {modality}
                </Typography>
                <Typography sx={typographyStyles.header}>
                    |
                </Typography>
                <Typography sx={typographyStyles.header}>
                    {shift}
                </Typography>
            </Box>

            <Box className="w-full bg-primary-action-pure pt-6 pb-4 px-4">
                <Box className="flex items-center mb-2 gap-x-1">
                    <Typography sx={typographyStyles.priceLabel}>
                        De
                    </Typography>
                    <Typography sx={typographyStyles.priceLabelStrikethrough}>
                        R$ {"  "}
                        {originalPrice.toLocaleString("pt-BR", {
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
                            {installments}x
                        </Typography>
                        <Typography sx={typographyStyles.priceMain}>
                            R${" "}
                            {currentPrice.toLocaleString("pt-BR", {
                                minimumFractionDigits: 2,
                            })}
                        </Typography>
                    </Box>
                </Box>
                <Box className="mb-6">
                    <Typography sx={typographyStyles.priceSecondary}>
                        à vista R${" "}
                        {installmentValue.toLocaleString("pt-BR", {
                            minimumFractionDigits: 2,
                        })}
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    fullWidth
                    className="b-4 w-[333px] h-[48px]"
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
                    {location}
                </Typography>
                <Typography
                    className="text-neutral-dark-low uppercase"
                    sx={typographyStyles.locationAddress}
                >
                    {address}
                </Typography>
            </Box>
        </Box>
    );
}
