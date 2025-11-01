import { Box, Typography, Collapse } from "@mui/material";
import { Add, Remove } from "@mui/icons-material";
import { useState } from "react";

const typographyStyles = {
    title: {
        fontFamily: "Inter",
        fontWeight: "500",
        fontSize: "16px",
        lineHeight: "115%",
        color: "#121212",
    },
    description: {
        fontFamily: "Inter",
        fontWeight: "400",
        fontSize: "14px",
        lineHeight: "115%",
        color: "#4A4A4A",
        marginTop: "8px",
    },
};

interface DrawerInfoProps {
    title: string;
    description: string;
}

export default function DrawerInfo({ title, description }: DrawerInfoProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    const handleToggle = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <Box
            sx={{
                border: "1px solid #E0E0E0",
                borderRadius: "8px",
                cursor: "pointer",
                transition: "all 0.2s",
                "&:hover": {
                    borderColor: "#B0B0B0",
                    backgroundColor: "#F5F5F5",
                },
            }}
            onClick={handleToggle}
        >
            <Box
                sx={{
                    p: "24px",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <Typography sx={typographyStyles.title}>{title}</Typography>
                {isExpanded ? (
                    <Remove
                        sx={{
                            width: "24px",
                            height: "24px",
                            color: "#121212",
                            flexShrink: 0,
                            marginLeft: "16px",
                        }}
                    />
                ) : (
                    <Add
                        sx={{
                            width: "24px",
                            height: "24px",
                            color: "#121212",
                            flexShrink: 0,
                            marginLeft: "16px",
                        }}
                    />
                )}
            </Box>
            <Collapse in={isExpanded}>
                <Box sx={{ px: "24px", pb: "24px" }}>
                    <Typography sx={typographyStyles.description}>
                        {description}
                    </Typography>
                </Box>
            </Collapse>
        </Box>
    );
}
