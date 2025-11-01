import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Box } from "@mui/material";

import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import StudentForm from "./pages/StudentForm";
import Success from "./pages/Success";
import { CourseProvider } from "./contexts/CourseContext";
import { DrawerProvider } from "./contexts/DrawerContext";
import { EnrollmentProvider } from "./contexts/EnrollmentContext";
import CourseDrawer from "./components/CourseDrawer";

function App() {
    return (
        <BrowserRouter>
            <CourseProvider>
                <EnrollmentProvider>
                    <DrawerProvider>
                        <Box sx={{ mx: "auto" }}>
                            <Header />
                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route
                                    path="/student-form"
                                    element={<StudentForm />}
                                />
                                <Route path="/success" element={<Success />} />
                            </Routes>
                            <Footer />
                            <CourseDrawer />
                        </Box>
                    </DrawerProvider>
                </EnrollmentProvider>
            </CourseProvider>
        </BrowserRouter>
    );
}

export default App;
