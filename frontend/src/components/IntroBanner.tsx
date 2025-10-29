import { Box, Typography } from "@mui/material";

export default function IntroBanner({
    title,
    subtitle,
}: {
    title?: String;
    subtitle?: String;
}) {
    return (
        <Box
            component="section"
            className="bg-primary-action-pure text-white py-10"
        >
            <Box className="max-w-[1366px] mx-auto">
                {title && (
                    <Typography
                        component="h1"
                        sx={{
                            fontFamily: "Montserrat",
                            fontWeight: "500",
                            fontSize: "32px",
                            lineHeight: "120%",
                            letterSpacing: "0%",
                            color: "white",
                        }}
                    >
                        {title}
                    </Typography>
                )}
                {subtitle && (
                    <Typography
                        component="h2"
                        sx={{
                            fontFamily: "Inter",
                            fontWeight: "400",
                            fontSize: "16px",
                            lineHeight: "150%",
                            letterSpacing: "0%",
                            color: "white",
                            marginTop: "8px",
                        }}
                    >
                        {subtitle}
                    </Typography>
                )}
            </Box>
        </Box>
    );
}
