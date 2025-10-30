import { Box, Typography } from "@mui/material";
import InfoOutlineIcon from "@mui/icons-material/InfoOutline";

export default function IntroBanner({
    title,
    subtitle,
    type,
}: {
    title?: String;
    subtitle?: String;
    type?: String;
}) {
    return (
        <Box
            component="section"
            className="bg-primary-action-pure text-white py-10"
        >
            <Box className="max-w-[1366px] mx-auto">
                {type !== "EaD" ? (
                    <>
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
                    </>
                ) : (
                    <>
                        <Box className="px-8">
                            <InfoOutlineIcon
                                sx={{
                                    width: "24px",
                                    height: "24px",
                                    color: "white",
                                }}
                            />
                            <Typography
                                component="h1"
                                sx={{
                                    fontFamily: "Montserrat",
                                    fontWeight: "400",
                                    fontSize: "16px",
                                    lineHeight: "150%",
                                    letterSpacing: "0%",
                                    color: "white",
                                    marginTop: "8px",
                                }}
                            >
                                {title}
                            </Typography>
                        </Box>
                    </>
                )}
            </Box>
        </Box>
    );
}
