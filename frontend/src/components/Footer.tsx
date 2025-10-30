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
        <Box className="flex gap-14">
            <Box className="flex items-center gap-3">
                <Box component="img" src={phoneIcon} alt="Telefone" />
                <Typography sx={contactTypographyStyle}>0800 771 5055</Typography>
            </Box>
            <Box
                component="a"
                href="#"
                className="flex items-center gap-3 transition-all duration-200 ease-in-out hover:scale-105"
            >
                <Box component="img" src={whatsappIcon} alt="WhatsApp" />
                <Typography sx={contactTypographyStyle}>Precisa de ajuda?</Typography>
            </Box>
        </Box>
    );

    return (
        <Box
            component="footer"
            className="bg-primary-action-low/90 text-white py-6"
        >
            <Box className="max-w-[1366px] mx-auto">
                <Box className="flex items-center justify-between">
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
                        <Box sx={{ display: "flex", alignItems: "center", gap: "16px" }}>
                            <Link to="/privacy-policy" style={{ textDecoration: "none", display: "flex", alignItems: "center" }}>
                                <Typography sx={{...typographyStyle, fontSize: "16px", lineHeight: "150%"}}>
                                    Política de privacidade
                                </Typography>
                            </Link>
                            <Typography sx={{...typographyStyle}}>
                                |
                            </Typography>
                            <Typography sx={{...typographyStyle}}>
                                Estácio Brasil - Todos os direitos reservados
                            </Typography>
                        </Box>
                    )}
                </Box>
            </Box>
        </Box>
    );
}
