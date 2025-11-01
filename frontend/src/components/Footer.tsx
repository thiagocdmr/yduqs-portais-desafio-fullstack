import { Box, Typography } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import estacioLogo from "../assets/logos/estacio_white_logo.svg";
import phoneIcon from "../assets/icons/phone_icon.svg";
import whatsappIcon from "../assets/icons/whatsapp_icon.svg";

const contactTypographyStyle = {
    fontFamily: "Inter",
    fontWeight: "600",
    fontSize: "16px",
    leadingTrim: "NONE",
    lineHeight: "150%",
    letterSpacing: "0%",
    color: "white",
};

const typographyStyle = {
    fontFamily: "Inter",
    fontWeight: "400",
    fontSize: "14px",
    leadingTrim: "NONE",
    lineHeight: "150%",
    letterSpacing: "0%",
    color: "white",
    fontColor: "#001F66",
};

export default function Footer() {
    const location = useLocation();
    const isStudentForm = location.pathname === "/student-form";

    const contactBox = (
        <Box
            sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                alignItems: { xs: "flex-start", md: "flex-start" },
                gap: { xs: "24px", md: "56px" },
            }}
        >
            <Box
                component="a"
                href="#"
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    transition: "all 0.2s ease-in-out",
                    "&:hover": { transform: "scale(1.05)" },
                    textDecoration: "none",
                    order: { xs: 1, md: 2 },
                }}
            >
                <Box component="img" src={whatsappIcon} alt="WhatsApp" />
                <Typography sx={contactTypographyStyle}>
                    Precisa de ajuda?
                </Typography>
            </Box>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    order: { xs: 2, md: 1 },
                }}
            >
                <Box component="img" src={phoneIcon} alt="Telefone" />
                <Typography sx={contactTypographyStyle}>
                    0800 771 5055
                </Typography>
            </Box>
        </Box>
    );

    return (
        <Box
            component="footer"
            sx={{
                backgroundColor: "rgba(0, 31, 102, 0.9)",
                color: "white",
                pt: { xs: "16px", md: "24px" },
                pb: "24px",
                px: { xs: "16px", md: "0" },
            }}
        >
            <Box sx={{ maxWidth: "1366px", mx: "auto" }}>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: { xs: "column", md: "row" },
                        alignItems: { xs: "flex-start", md: "flex-start" },
                        justifyContent: { xs: "flex-start", md: "space-between" },
                        gap: { xs: "24px", md: "0" },
                    }}
                >
                    {!isStudentForm && (
                        <Link to="/">
                            <Box
                                component="img"
                                src={estacioLogo}
                                alt="Logo Estácio"
                                sx={{ cursor: "pointer" }}
                            />
                        </Link>
                    )}
                    {contactBox}
                    {isStudentForm && (
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: { xs: "column", md: "row" },
                                justifyContent: { xs: "flex-start", md: "flex-start" },
                                alignItems: { xs: "flex-start", md: "center" },
                                gap: { xs: "4px", md: "16px" },
                            }}
                        >
                            <Link
                                to="/privacy-policy"
                                style={{
                                    textDecoration: "none",
                                    display: "flex",
                                    alignItems: "center",
                                }}
                            >
                                <Typography
                                    sx={{
                                        ...typographyStyle,
                                        fontSize: "16px",
                                        lineHeight: "150%",
                                    }}
                                >
                                    Política de privacidade
                                </Typography>
                            </Link>
                            <Typography sx={{ ...typographyStyle, display: { xs: "none", md: "block" } }}>
                                |
                            </Typography>
                            <Typography sx={{ ...typographyStyle, paddingTop: { xs: "4px", md: "0" } }}>
                                Estácio Brasil - Todos os direitos reservados
                            </Typography>
                        </Box>
                    )}
                </Box>
            </Box>
        </Box>
    );
}
