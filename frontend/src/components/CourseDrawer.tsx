import { Drawer, Box, Typography, IconButton, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import { useDrawer } from "../contexts/DrawerContext";
import { useEnrollment } from "../contexts/EnrollmentContext";
import DrawerInfo from "./DrawerInfo";
import InstallmentPlanList from "./InstallmentPlanList";
import IntroBanner from "./IntroBanner";

const typographyStyles = {
    title: {
        fontFamily: "Montserrat",
        fontWeight: "500",
        fontSize: "32px",
        lineHeight: "125%",
        color: "#121212",
    },
};

export default function CourseDrawer() {
    const { isOpen, selectedCourse, closeDrawer } = useDrawer();
    const { setSelectedCourse, setSelectedInstallmentPlan } = useEnrollment();
    const navigate = useNavigate();

    if (!selectedCourse) return null;

    return (
        <Drawer
            anchor="right"
            open={isOpen}
            onClose={closeDrawer}
            sx={{
                "& .MuiDrawer-paper": {
                    width: "40%",
                    minWidth: "400px",
                    maxWidth: "600px",
                },
            }}
        >
            <Box
                sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        pl: "32px",
                        pr: "16px",
                        py: "24px",
                        borderBottom: "1px solid #E5E7EB",
                    }}
                >
                    <Typography sx={typographyStyles.title}>
                        Mais detalhes
                    </Typography>
                    <IconButton
                        onClick={closeDrawer}
                        sx={{
                            color: "#4A4A4A",
                            "&:hover": {
                                backgroundColor: "rgba(0, 0, 0, 0.04)",
                            },
                        }}
                    >
                        <CloseIcon sx={{ width: "24px", height: "24px" }} />
                    </IconButton>
                </Box>

                <Box
                    sx={{
                        flex: 1,
                        overflowY: "auto",
                        display: "flex",
                        flexDirection: "column",
                        gap: "16px",
                    }}
                >
                    {selectedCourse.type === "Presencial" ? (
                        <InstallmentPlanList courseId={selectedCourse.id} />
                    ) : (
                        <IntroBanner
                            title="Inscreva-se para saber tudo sobre os valores e garantir a sua vaga!"
                            type="EaD"
                        />
                    )}

                    <Box sx={{ px: "32px" }}>
                        <Box sx={{ mt: "16px" }} />
                        <DrawerInfo
                            title="Sobre a bolsa incentivo"
                            description="Conheça os benefícios e condições da bolsa de estudos disponível para este curso."
                        />
                        <Box sx={{ mt: "24px" }} />
                        <DrawerInfo
                            title="Resumo das suas escolhas"
                            description="Veja um resumo completo das opções selecionadas para sua matrícula."
                        />
                        <Box sx={{ mt: "24px" }} />
                    </Box>
                </Box>

                <Box
                    sx={{
                        px: "32px",
                        py: "24px",
                        borderTop: "1px solid #E5E7EB",
                    }}
                >
                    <Button
                        variant="contained"
                        fullWidth
                        sx={{
                            backgroundColor: "#EE325D",
                            color: "white",
                            fontFamily: "Inter",
                            fontWeight: "500",
                            fontSize: "16px",
                            textTransform: "none",
                            lineHeight: "100%",
                            borderRadius: "8px",
                            height: "48px",
                            "&:hover": {
                                backgroundColor: "#DC2626",
                            },
                        }}
                        onClick={() => {
                            if (selectedCourse) {
                                setSelectedCourse(selectedCourse);
                                if (selectedCourse.type !== "Presencial") {
                                    setSelectedInstallmentPlan(null);
                                }
                                closeDrawer();
                                navigate("/student-form");
                            }
                        }}
                    >
                        Avançar
                    </Button>
                </Box>
            </Box>
        </Drawer>
    );
}
