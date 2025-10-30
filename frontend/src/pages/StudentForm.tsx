import { Box } from "@mui/material";
import IntroBanner from "../components/IntroBanner";
import StudentFormFields from "../components/StudentFormFields";

export default function StudentForm() {
    return (
        <Box>
            <IntroBanner title="Queremos saber um pouco mais sobre você" />
            <StudentFormFields />
        </Box>
    );
}