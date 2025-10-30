import { Drawer, Box, Typography, IconButton, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useDrawer } from "../contexts/DrawerContext";
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
            <Box className="h-full flex flex-col">
                <Box className="flex items-center justify-between pl-8 pr-4 py-6 border-b border-gray-200">
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

                <Box className="flex-1 overflow-y-auto flex flex-col gap-4">
                    {selectedCourse.type === "Presencial" ? (
                        <InstallmentPlanList courseId={selectedCourse.id} />
                    ) : (
                        <IntroBanner
                            title="Inscreva-se para saber tudo sobre os valores e garantir a sua vaga!"
                            type="EaD"
                        />
                    )}

                    <Box className="px-8">
                        <Box className="mt-4" />
                        <DrawerInfo
                            title="Sobre a bolsa incentivo"
                            description="Conheça os benefícios e condições da bolsa de estudos disponível para este curso."
                        />
                        <Box className="mt-6" />
                        <DrawerInfo
                            title="Resumo das suas escolhas"
                            description="Veja um resumo completo das opções selecionadas para sua matrícula."
                        />
                        <Box className="mt-6" />
                    </Box>
                </Box>

                <Box className="px-8 py-6 border-t border-gray-200">
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
                        onClick={closeDrawer}
                    >
                        Avançar
                    </Button>
                </Box>
            </Box>
        </Drawer>
    );
}
