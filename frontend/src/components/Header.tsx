import { Box } from '@mui/material';
import estacioLogo from '../assets/logos/estacio_black_logo.svg';

export default function Header() {
    return (
        <Box component="header" className="py-6 max-w-[1366px] mx-auto">
            <Box
                component="img"
                src={estacioLogo} 
                alt="Logo Estácio"
            />
        </Box>
    );
}
