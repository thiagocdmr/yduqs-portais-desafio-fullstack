import { Box } from "@mui/material";
import { Link } from "react-router-dom";
import estacioLogo from "../assets/logos/estacio_black_logo.svg";

export default function Header() {
    return (
        <Box
            component="header"
            sx={{
                py: { xs: "16px", md: "24px" },
                maxWidth: { xs: "100%", md: "1366px" },
                mx: "auto",
                px: { xs: "16px", md: "0" },
            }}
        >
            <Link to="/">
                <Box
                    component="img"
                    src={estacioLogo}
                    alt="Logo Estácio"
                    sx={{ cursor: "pointer" }}
                />
            </Link>
        </Box>
    );
}
