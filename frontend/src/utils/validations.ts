import { isValidCPF, formatCPF as formatCPFUtil, isValidMobilePhone, isValidEmail } from '@brazilian-utils/brazilian-utils';

// Validação de nome completo
export const validateFullName = (name: string): string | undefined => {
    if (!name.trim()) {
        return "Nome completo é obrigatório";
    }
    const nameParts = name.trim().split(/\s+/);
    if (nameParts.length < 2 || nameParts.some((part) => part.length === 0)) {
        return "Nome completo deve conter pelo menos nome e sobrenome (ex: João Silva)";
    }
    return undefined;
};

// Validação de CPF
export const validateCPF = (cpf: string): string | undefined => {
    if (!cpf) {
        return "CPF é obrigatório";
    }

    if (!isValidCPF(cpf)) {
        return "CPF inválido";
    }

    return undefined;
};

// Validação de data de nascimento
export const validateBirthDate = (dateString: string): string | undefined => {
    if (!dateString) {
        return "Data de nascimento é obrigatória";
    }

    const birthDate = new Date(dateString);
    const today = new Date();

    if (isNaN(birthDate.getTime())) {
        return "Data de nascimento inválida";
    }

    if (birthDate > today) {
        return "Data de nascimento não pode ser futura";
    }

    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();

    const actualAge =
        monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? age - 1 : age;

    if (actualAge > 125) {
        return "Data de nascimento inválida (não pode ser maior que 125 anos)";
    }

    return undefined;
};

// Validação de email
export const validateEmail = (email: string): string | undefined => {
    if (!email) {
        return "E-mail é obrigatório";
    }
    
    if (!isValidEmail(email)) {
        return "E-mail inválido";
    }
    
    return undefined;
};

// Validação de telefone
export const validatePhone = (phone: string): string | undefined => {
    if (!phone) {
        return "Celular é obrigatório";
    }
    
    const cleanPhone = phone.replace(/\D/g, "");
    
    if (!isValidMobilePhone(cleanPhone)) {
        return "Celular inválido (deve conter DDD + 9 dígitos)";
    }
    
    return undefined;
};

// Validação de ano de conclusão
export const validateHighSchoolYear = (year: string): string | undefined => {
    if (!year) {
        return "Ano de conclusão do ensino médio é obrigatório";
    }

    const yearNum = parseInt(year);
    const currentYear = new Date().getFullYear();

    if (isNaN(yearNum)) {
        return "Ano de conclusão deve ser um número";
    }

    if (yearNum < 1900) {
        return "Ano de conclusão deve ser maior ou igual a 1900";
    }

    if (yearNum > 9999) {
        return "Ano de conclusão deve ter 4 dígitos";
    }

    if (yearNum > currentYear) {
        return "Ano de conclusão não pode ser maior que o ano atual";
    }

    return undefined;
};

// Máscara de CPF
export const formatCPF = (value: string): string => {
    const cleanValue = value.replace(/\D/g, "");
    if (cleanValue.length === 0) return "";
    return formatCPFUtil(cleanValue);
};

// Máscara de telefone
export const formatPhone = (value: string): string => {
    const cleanValue = value.replace(/\D/g, "");
    if (cleanValue.length <= 11) {
        return cleanValue
            .replace(/(\d{2})(\d)/, "($1) $2")
            .replace(/(\d{5})(\d)/, "$1-$2");
    }
    return value;
};
