import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useEnrollment } from "../contexts/EnrollmentContext";
import IntroBanner from "../components/IntroBanner";

export default function Success() {
    const navigate = useNavigate();
    const { clearEnrollment } = useEnrollment();

    useEffect(() => {
        // Limpar dados da matrícula após 5 segundos
        const timer = setTimeout(() => {
            clearEnrollment();
        }, 5000);

        return () => clearTimeout(timer);
    }, [clearEnrollment]);

    const handleBackToHome = () => {
        clearEnrollment();
        navigate("/");
    };

    return (
        <Box>
            <IntroBanner title="Matrícula realizada com sucesso!" />
            <Box className="max-w-[1366px] mx-auto py-12 px-4">
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        textAlign: "center",
                        gap: 3,
                    }}
                >
                    <Box
                        sx={{
                            width: "80px",
                            height: "80px",
                            borderRadius: "50%",
                            backgroundColor: "#4CAF50",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            mb: 2,
                        }}
                    >
                        <Typography
                            sx={{
                                fontSize: "48px",
                                color: "white",
                            }}
                        >
                            ✓
                        </Typography>
                    </Box>

                    <Typography
                        sx={{
                            fontFamily: "Inter",
                            fontSize: "24px",
                            fontWeight: "600",
                            color: "#121212",
                            mb: 2,
                        }}
                    >
                        Sua matrícula foi processada com sucesso!
                    </Typography>

                    <Typography
                        sx={{
                            fontFamily: "Inter",
                            fontSize: "18px",
                            fontWeight: "400",
                            color: "#666666",
                            maxWidth: "600px",
                            lineHeight: "150%",
                        }}
                    >
                        Em breve você receberá um e-mail de confirmação com todas as
                        informações sobre sua matrícula e os próximos passos.
                    </Typography>

                    <Typography
                        sx={{
                            fontFamily: "Inter",
                            fontSize: "16px",
                            fontWeight: "400",
                            color: "#666666",
                            maxWidth: "600px",
                            lineHeight: "150%",
                            mt: 2,
                        }}
                    >
                        Não se esqueça de verificar sua caixa de spam caso não encontre
                        o e-mail na caixa de entrada.
                    </Typography>

                    <Button
                        variant="contained"
                        onClick={handleBackToHome}
                        sx={{
                            backgroundColor: "#144BC8",
                            color: "white",
                            fontFamily: "Inter",
                            fontWeight: "500",
                            fontSize: "16px",
                            textTransform: "none",
                            borderRadius: "8px",
                            height: "48px",
                            padding: "0 32px",
                            mt: 4,
                            "&:hover": {
                                backgroundColor: "#0F3A9F",
                            },
                        }}
                    >
                        Voltar para a página inicial
                    </Button>
                </Box>
            </Box>
        </Box>
    );
}
