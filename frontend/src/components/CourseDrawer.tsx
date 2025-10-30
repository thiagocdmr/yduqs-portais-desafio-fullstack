import { Drawer, Box, Typography, IconButton, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useDrawer } from "../contexts/DrawerContext";

const typographyStyles = {
    title: {
        fontFamily: "Montserrat",
        fontWeight: "500",
        fontSize: "32px",
        lineHeight: "125%",
        color: "#121212",
    }
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
                <Box className="flex items-center justify-between p-6 border-b border-gray-200">
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
                
                <Box className="flex-1 overflow-y-auto p-6">
                </Box>

                <Box className="p-6 border-t border-gray-200">
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
