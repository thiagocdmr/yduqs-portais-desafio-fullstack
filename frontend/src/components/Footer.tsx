import { Box, Typography } from "@mui/material";
import estacioLogo from "../assets/logos/estacio_white_logo.svg";
import phoneIcon from "../assets/icons/phone_icon.svg";
import whatsappIcon from "../assets/icons/whatsapp_icon.svg";

export default function Footer() {
    return (
        <Box
            component="footer"
            className="bg-primary-action-low/90 text-white py-6"
        >
            <Box className="max-w-[1366px] mx-auto">
                <Box className="flex items-center justify-between">
                    <Box component="img" src={estacioLogo} alt="Logo Estácio" />
                    <Box className="flex gap-14">
                        <Box className="flex items-center gap-3">
                            <Box
                                component="img"
                                src={phoneIcon}
                                alt="Telefone"
                            />
                            <Typography
                                sx={{
                                    fontFamily: 'Inter',
                                    fontWeight: "600",
                                    fontSize: "16px",
                                    leadingTrim: "NONE",
                                    lineHeight: "150%",
                                    letterSpacing: "0%",
                                    color: "white",
                                }}
                            >
                                0800 771 5055
                            </Typography>
                        </Box>
                        <Box
                            component="a"
                            href="#"
                            className="flex items-center gap-3 transition-all duration-200 ease-in-out hover:scale-105"
                        >
                            <Box
                                component="img"
                                src={whatsappIcon}
                                alt="WhatsApp"
                            />
                            <Typography
                                sx={{
                                    fontFamily: 'Inter',
                                    fontWeight: "600",
                                    fontSize: "16px",
                                    leadingTrim: "NONE",
                                    lineHeight: "150%",
                                    letterSpacing: "0%",
                                    color: "white",
                                }}
                            >
                                Precisa de ajuda?
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}
