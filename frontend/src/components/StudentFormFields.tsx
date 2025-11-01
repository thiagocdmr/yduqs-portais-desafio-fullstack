import { useState, useEffect } from "react";
import {
    Box,
    TextField,
    Button,
    Checkbox,
    Typography,
    Link,
    CircularProgress,
    Alert,
} from "@mui/material";
import { useEnrollment } from "../contexts/EnrollmentContext";
import { useNavigate } from "react-router-dom";
import {
    validateFullName,
    validateCPF,
    validateBirthDate,
    validateEmail,
    validatePhone,
    validateHighSchoolYear,
    formatCPF,
    formatPhone,
} from "../utils/validations";
import { enrollmentService } from "../services/enrollmentService";

interface FormData {
    fullName: string;
    cpf: string;
    birthDate: string;
    email: string;
    phone: string;
    highSchoolCompletionYear: string;
    agreeToTerms: boolean;
    receiveWhatsappNotifications: boolean;
}

interface FormErrors {
    fullName?: string;
    cpf?: string;
    birthDate?: string;
    email?: string;
    phone?: string;
    highSchoolCompletionYear?: string;
}

const typographyStyles = {
    checkboxLabel: {
        fontFamily: "Inter",
        fontSize: "16px",
        fontWeight: "500",
        lineHeight: "133%",
        color: "#121212",
    },
    link: {
        color: "#121212",
        textDecoration: "underline",
        "&:hover": {
            textDecoration: "underline",
        },
    },
};

const textFieldStyles = {
    width: "680px",
    "& .MuiOutlinedInput-root": {
        fontFamily: "Inter",
        fontSize: "16px",
        fontWeight: "400",
        borderRadius: "4px",
        height: "57px",
    },
    "& .MuiInputLabel-root": {
        fontFamily: "Inter",
        fontSize: "14px",
        fontWeight: "400",
    },
};

export default function StudentFormFields() {
    const { selectedCourse, selectedInstallmentPlan } = useEnrollment();
    const navigate = useNavigate();

    const [formData, setFormData] = useState<FormData>({
        fullName: "",
        cpf: "",
        birthDate: "",
        email: "",
        phone: "",
        highSchoolCompletionYear: "",
        agreeToTerms: false,
        receiveWhatsappNotifications: false,
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {
            fullName: validateFullName(formData.fullName),
            cpf: validateCPF(formData.cpf),
            birthDate: validateBirthDate(formData.birthDate),
            email: validateEmail(formData.email),
            phone: validatePhone(formData.phone),
            highSchoolCompletionYear: validateHighSchoolYear(
                formData.highSchoolCompletionYear
            ),
        };

        setErrors(newErrors);

        return (
            !newErrors.fullName &&
            !newErrors.cpf &&
            !newErrors.birthDate &&
            !newErrors.email &&
            !newErrors.phone &&
            !newErrors.highSchoolCompletionYear &&
            formData.agreeToTerms
        );
    };

    const isFormValid = (): boolean => {
        return (
            !errors.fullName &&
            !errors.cpf &&
            !errors.birthDate &&
            !errors.email &&
            !errors.phone &&
            !errors.highSchoolCompletionYear &&
            formData.fullName.trim() !== "" &&
            formData.cpf.trim() !== "" &&
            formData.birthDate.trim() !== "" &&
            formData.email.trim() !== "" &&
            formData.phone.trim() !== "" &&
            formData.highSchoolCompletionYear.trim() !== "" &&
            formData.agreeToTerms
        );
    };

    const handleChange =
        (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
            let value: string | boolean = e.target.value;

            if (field === "cpf") {
                value = formatCPF(value as string);
            } else if (field === "phone") {
                value = formatPhone(value as string);
            } else if (
                field === "agreeToTerms" ||
                field === "receiveWhatsappNotifications"
            ) {
                value = e.target.checked;
            }

            setFormData((prev) => ({ ...prev, [field]: value }));
        };

    const handleBlur = (field: keyof FormData) => () => {
        setTouched((prev) => ({ ...prev, [field]: true }));

        let error: string | undefined;
        switch (field) {
            case "fullName":
                error = validateFullName(formData.fullName);
                break;
            case "cpf":
                error = validateCPF(formData.cpf);
                break;
            case "birthDate":
                error = validateBirthDate(formData.birthDate);
                break;
            case "email":
                error = validateEmail(formData.email);
                break;
            case "phone":
                error = validatePhone(formData.phone);
                break;
            case "highSchoolCompletionYear":
                error = validateHighSchoolYear(
                    formData.highSchoolCompletionYear
                );
                break;
        }

        setErrors((prev) => ({ ...prev, [field]: error }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setTouched({
            fullName: true,
            cpf: true,
            birthDate: true,
            email: true,
            phone: true,
            highSchoolCompletionYear: true,
        });

        if (!validateForm()) {
            return;
        }

        if (!selectedCourse) {
            setSubmitError("Curso não selecionado.");
            return;
        }

        if (selectedCourse.type === "Presencial" && !selectedInstallmentPlan) {
            setSubmitError("Plano de pagamento não selecionado.");
            return;
        }

        setIsSubmitting(true);
        setSubmitError(null);

        try {
            const enrollmentData = {
                student: {
                    fullName: formData.fullName,
                    cpf: formData.cpf,
                    birthDate: formData.birthDate,
                    email: formData.email,
                    phone: formData.phone,
                    highSchoolCompletionYear: parseInt(
                        formData.highSchoolCompletionYear
                    ),
                    agreeToTerms: formData.agreeToTerms,
                    receiveWhatsappNotifications:
                        formData.receiveWhatsappNotifications,
                },
                paymentInfo: {
                    courseId: selectedCourse.id,
                    ...(selectedInstallmentPlan && {
                        installments: selectedInstallmentPlan.installments,
                        installmentValue:
                            selectedInstallmentPlan.installmentValue,
                        totalPrice: selectedInstallmentPlan.totalPrice,
                    }),
                },
            };

            await enrollmentService.createEnrollment(enrollmentData);
            navigate("/success");
        } catch (error: any) {
            console.error("Erro ao criar matrícula:", error);

            setIsSubmitting(false);

            if (error.response?.status === 409) {
                setSubmitError(
                    "CPF ou e-mail já cadastrado. Por favor, verifique seus dados."
                );
            } else if (error.response?.status === 404) {
                setSubmitError(
                    "Curso não encontrado. Por favor, selecione novamente."
                );
            } else if (error.response?.data?.message) {
                setSubmitError(error.response.data.message);
            } else {
                setSubmitError(
                    "Erro ao processar sua matrícula. Por favor, tente novamente."
                );
            }
        }
    };

    useEffect(() => {
        if (!selectedCourse) {
            navigate("/");
        } else if (
            selectedCourse.type === "Presencial" &&
            !selectedInstallmentPlan
        ) {
            navigate("/");
        }
    }, [selectedCourse, selectedInstallmentPlan, navigate]);

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
                maxWidth: "1366px",
                mx: "auto",
                py: "32px",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
            }}
        >
            <TextField
                label="Nome completo"
                value={formData.fullName}
                onChange={handleChange("fullName")}
                onBlur={handleBlur("fullName")}
                error={touched.fullName && !!errors.fullName}
                helperText={
                    touched.fullName && errors.fullName ? (
                        errors.fullName
                    ) : (
                        <span>
                            Preencha seu nome completo, sem abreviações, igual
                            ao seu documento de identificação.{" "}
                            <Link href="#" sx={typographyStyles.link}>
                                Confira o exemplo.
                            </Link>
                        </span>
                    )
                }
                placeholder="Marina Borges"
                sx={textFieldStyles}
                margin="normal"
            />

            <TextField
                label="CPF"
                value={formData.cpf}
                onChange={handleChange("cpf")}
                onBlur={handleBlur("cpf")}
                error={touched.cpf && !!errors.cpf}
                helperText={touched.cpf && errors.cpf}
                placeholder="091.685.659-45"
                sx={textFieldStyles}
                margin="normal"
            />

            <TextField
                label="Data de nascimento"
                type="date"
                value={formData.birthDate}
                onChange={handleChange("birthDate")}
                onBlur={handleBlur("birthDate")}
                error={touched.birthDate && !!errors.birthDate}
                helperText={touched.birthDate && errors.birthDate}
                InputLabelProps={{ shrink: true }}
                sx={textFieldStyles}
                margin="normal"
            />

            <TextField
                label="E-mail"
                type="email"
                value={formData.email}
                onChange={handleChange("email")}
                onBlur={handleBlur("email")}
                error={touched.email && !!errors.email}
                helperText={touched.email && errors.email}
                placeholder="marina.borges@gmail.com"
                sx={textFieldStyles}
                margin="normal"
            />

            <TextField
                label="Celular para contato"
                value={formData.phone}
                onChange={handleChange("phone")}
                onBlur={handleBlur("phone")}
                error={touched.phone && !!errors.phone}
                helperText={touched.phone && errors.phone}
                placeholder="(19) 9000-9445"
                sx={textFieldStyles}
                margin="normal"
            />

            <TextField
                label="Ano de conclusão do ensino médio"
                type="number"
                value={formData.highSchoolCompletionYear}
                onChange={handleChange("highSchoolCompletionYear")}
                onBlur={handleBlur("highSchoolCompletionYear")}
                error={
                    touched.highSchoolCompletionYear &&
                    !!errors.highSchoolCompletionYear
                }
                helperText={
                    touched.highSchoolCompletionYear &&
                    errors.highSchoolCompletionYear
                }
                placeholder="2015"
                sx={textFieldStyles}
                margin="normal"
            />

            <Box
                sx={{
                    mt: "24px",
                    width: "680px",
                    display: "flex",
                    alignItems: "flex-start",
                }}
            >
                <Checkbox
                    checked={formData.agreeToTerms}
                    onChange={handleChange("agreeToTerms")}
                    sx={{
                        color: "#121212",
                        padding: "0 8px 0 0",
                        "&.Mui-checked": {
                            color: "#121212",
                        },
                    }}
                />
                <Typography sx={typographyStyles.checkboxLabel}>
                    Li e concordo com os{" "}
                    <Link
                        href="#"
                        sx={typographyStyles.link}
                        onClick={(e) => e.stopPropagation()}
                    >
                        termos do edital
                    </Link>
                    , bem como com o tratamento dos meus dados para fins de
                    prospecção dos serviços educacionais prestados pela Estácio
                    e demais instituições de ensino do mesmo{" "}
                    <Link
                        href="#"
                        sx={typographyStyles.link}
                        onClick={(e) => e.stopPropagation()}
                    >
                        Grupo Econômico
                    </Link>
                    , de acordo com a nossa{" "}
                    <Link
                        href="#"
                        sx={typographyStyles.link}
                        onClick={(e) => e.stopPropagation()}
                    >
                        política de privacidade
                    </Link>
                    .
                </Typography>
            </Box>

            <Box
                sx={{
                    mt: "24px",
                    width: "680px",
                    display: "flex",
                    alignItems: "flex-start",
                }}
            >
                <Checkbox
                    checked={formData.receiveWhatsappNotifications}
                    onChange={handleChange("receiveWhatsappNotifications")}
                    sx={{
                        color: "#121212",
                        padding: "0 8px 0 0",
                        "&.Mui-checked": {
                            color: "#121212",
                        },
                    }}
                />
                <Typography sx={typographyStyles.checkboxLabel}>
                    Aceito receber atualizações sobre minha inscrição pelo
                    WhatsApp.
                </Typography>
            </Box>

            <Box sx={{ mt: "32px" }}>
                <Button
                    type="submit"
                    variant="contained"
                    disabled={!isFormValid() || isSubmitting}
                    sx={{
                        backgroundColor: "#144BC8",
                        color: "white",
                        fontFamily: "Inter",
                        fontWeight: "500",
                        fontSize: "16px",
                        textTransform: "none",
                        lineHeight: "100%",
                        borderRadius: "8px",
                        height: "48px",
                        padding: "0 32px",
                        marginBottom: "24px",
                        minWidth: "auto",
                        width: "auto",
                        "&:hover": {
                            backgroundColor: "#0F3A9F",
                        },
                        "&:disabled": {
                            backgroundColor: "#E0E0E0",
                            color: "#9E9E9E",
                        },
                    }}
                >
                    {isSubmitting ? (
                        <>
                            <CircularProgress
                                size={20}
                                sx={{ color: "white", mr: "4px" }}
                            />
                            Processando...
                        </>
                    ) : (
                        "Avançar"
                    )}
                </Button>
            </Box>
            {submitError && (
                <Alert severity="error" sx={{ width: "680px" }}>
                    {submitError}
                </Alert>
            )}
        </Box>
    );
}
