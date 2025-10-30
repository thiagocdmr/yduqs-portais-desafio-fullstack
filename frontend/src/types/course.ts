export interface Course {
    id: number;
    modality: string;
    period: string | null;
    originalPrice: number | null;
    installmentPrice: number | null;
    installments: number | null;
    cashPrice: number | null;
    description: string | null;
    type: string;
    location: {
        city: string;
        unit: string;
        address: string;
    };
}
