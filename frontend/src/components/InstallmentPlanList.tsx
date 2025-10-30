import { useState, useEffect } from "react";
import {
    Box,
    Typography,
    Radio,
    RadioGroup,
    FormControlLabel,
    CircularProgress,
} from "@mui/material";
import { courseService } from "../services/courseService";
import type { InstallmentPlan } from "../types/installmentPlan";

interface InstallmentPlanListProps {
    courseId: number;
}

const typographyStyles = {
    title: {
        fontFamily: "Inter",
        fontWeight: "500",
        fontSize: "16px",
        lineHeight: "130%",
        color: "#121212",
    },
    headerLabel: {
        fontFamily: "Inter",
        fontWeight: "400",
        fontSize: "16px",
        lineHeight: "171%",
        color: "white",
    },
    installmentValue: {
        fontFamily: "Inter",
        fontWeight: "500",
        fontSize: "14px",
        lineHeight: "117%",
        color: "#121212",
    },
    totalValue: {
        fontFamily: "Inter",
        fontWeight: "400",
        fontSize: "14px",
        lineHeight: "117%",
        color: "#3D3D3D",
    },
};

const radioStyles = {
    color: "#121212",
    padding: "8px",
    "&.Mui-checked": {
        color: "#121212",
    },
    "& .MuiSvgIcon-root": {
        fontSize: 24,
    },
};

const boxStyles = {
    container: {
        border: "1px solid #E5E7EB",
        borderRadius: "8px",
        overflow: "hidden",
    },
    header: {
        display: "flex",
        alignItems: "left",
        backgroundColor: "#2563EB",
        padding: "8px 16px",
        gap: "16px",
    },
    listItem: (isSelected: boolean) => ({
        backgroundColor: isSelected ? "#F9FAFB" : "white",
        transition: "background-color 0.2s",
        "&:hover": {
            backgroundColor: "#F9FAFB",
        },
    }),
    labelContainer: {
        display: "flex",
        alignItems: "center",
        width: "100%",
        gap: "16px",
    },
    formControlLabel: {
        margin: 0,
        padding: "4px",
        width: "100%",
        "& .MuiFormControlLabel-label": {
            width: "100%",
        },
    },
};

const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    }).format(value);
};

export default function InstallmentPlanList({
    courseId,
}: InstallmentPlanListProps) {
    const [installmentPlans, setInstallmentPlans] = useState<
        InstallmentPlan[]
    >([]);
    const [loading, setLoading] = useState(true);
    const [selectedPlan, setSelectedPlan] = useState<number | null>(null);

    useEffect(() => {
        const fetchInstallmentPlans = async () => {
            try {
                setLoading(true);
                const data = await courseService.getInstallmentPlans(courseId);
                setInstallmentPlans(data);
                if (data.length > 0) {
                    setSelectedPlan(data[data.length - 1].id);
                }
            } catch (error) {
                console.error("Erro ao buscar planos de parcelamento:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchInstallmentPlans();
    }, [courseId]);

    if (loading) {
        return (
            <Box className="flex justify-center items-center py-8">
                <CircularProgress sx={{ color: "#2563EB" }} />
            </Box>
        );
    }

    if (installmentPlans.length === 0) {
        return null;
    }

    return (
        <Box className="flex flex-col">
            <Typography className="pb-4" sx={typographyStyles.title}>
                Qual dessas opções de parcelas você prefere?
            </Typography>

            <Box sx={boxStyles.container}>
                <Box sx={boxStyles.header}>
                    <Typography
                        sx={{
                            ...typographyStyles.headerLabel,
                            minWidth: "75%",
                        }}
                    >
                        Parcelas
                    </Typography>
                    <Typography
                        sx={{
                            ...typographyStyles.headerLabel,
                            paddingLeft: "16px",
                        }}
                    >
                        Total
                    </Typography>
                </Box>

                <RadioGroup
                    value={selectedPlan}
                    onChange={(e) => setSelectedPlan(Number(e.target.value))}
                >
                    {installmentPlans.map((plan, index) => (
                        <Box
                            key={plan.id}
                            sx={{
                                borderTop: index > 0 ? "1px solid #E5E7EB" : "none",
                                ...boxStyles.listItem(selectedPlan === plan.id),
                            }}
                        >
                            <FormControlLabel
                                value={plan.id}
                                control={<Radio sx={radioStyles} />}
                                label={
                                    <Box sx={boxStyles.labelContainer}>
                                        <Typography
                                            sx={{
                                                ...typographyStyles.installmentValue,
                                                minWidth: "75%",
                                            }}
                                        >
                                            {plan.installments}x{" "}
                                            {formatCurrency(plan.installmentValue)}
                                        </Typography>
                                        <Typography sx={typographyStyles.totalValue}>
                                            {formatCurrency(plan.totalPrice)}
                                        </Typography>
                                    </Box>
                                }
                                sx={boxStyles.formControlLabel}
                            />
                        </Box>
                    ))}
                </RadioGroup>
            </Box>
        </Box>
    );
}
