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
import { useEnrollment } from "../contexts/EnrollmentContext";

interface InstallmentPlanListProps {
    courseId: number;
}

const typographyStyles = {
    title: {
        fontFamily: "Inter",
        fontWeight: "500",
        fontSize: "16px",
        lineHeight: "135%",
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
    padding: { xs: "12px", md: "8px" },
    "&.Mui-checked": {
        color: "#121212",
    },
    "& .MuiSvgIcon-root": {
        fontSize: 24,
    },
};

const boxStyles = {
    container: {
        border: "1px solid #144BC8",
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
    const { setSelectedInstallmentPlan } = useEnrollment();
    const [installmentPlans, setInstallmentPlans] = useState<InstallmentPlan[]>(
        []
    );
    const [loading, setLoading] = useState(true);
    const [selectedPlan, setSelectedPlan] = useState<number | null>(null);

    useEffect(() => {
        const fetchInstallmentPlans = async () => {
            try {
                setLoading(true);
                const data = await courseService.getInstallmentPlans(courseId);
                setInstallmentPlans(data);
                if (data.length > 0) {
                    const defaultPlan = data[data.length - 1];
                    setSelectedPlan(defaultPlan.id);
                    setSelectedInstallmentPlan(defaultPlan);
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
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    py: "32px",
                }}
            >
                <CircularProgress sx={{ color: "#2563EB" }} />
            </Box>
        );
    }

    if (installmentPlans.length === 0) {
        return null;
    }

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                pt: { xs: "16px", md: "24px" },
                px: { xs: "16px", md: "32px" },
            }}
        >
            <Typography sx={{ ...typographyStyles.title, pb: "16px" }}>
                Qual dessas opções de parcelas você prefere?
            </Typography>

            <Box sx={boxStyles.container}>
                <Box sx={boxStyles.header}>
                    <Typography
                        sx={{
                            ...typographyStyles.headerLabel,
                            minWidth: { xs: "62%", md: "75%" },
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
                    onChange={(e) => {
                        const planId = Number(e.target.value);
                        setSelectedPlan(planId);
                        const plan = installmentPlans.find(
                            (p) => p.id === planId
                        );
                        if (plan) {
                            setSelectedInstallmentPlan(plan);
                        }
                    }}
                >
                    {installmentPlans.map((plan, index) => (
                        <Box
                            key={plan.id}
                            sx={{
                                borderTop:
                                    index > 0 ? "1px solid #144BC8" : "none",
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
                                                minWidth: { xs: "60%", md: "75%" },
                                            }}
                                        >
                                            {plan.installments}x{" "}
                                            {formatCurrency(
                                                plan.installmentValue
                                            )}
                                        </Typography>
                                        <Typography
                                            sx={typographyStyles.totalValue}
                                        >
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
