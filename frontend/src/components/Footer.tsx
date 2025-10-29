import estacioLogo from '../assets/logos/estacio_white_logo.svg';
import phoneIcon from '../assets/icons/phone_icon.svg';
import whatsappIcon from '../assets/icons/whatsapp_icon.svg';

export default function Footer() {
    return (
        <footer className="bg-primary-action-low text-white py-6">
            <div className="max-w-[1366px]  mx-auto">
                <div className="flex items-center justify-between">
                    <img 
                        src={estacioLogo} 
                        alt="Logo Estácio" 
                    />
                    <div className="flex gap-14">
                        <div className="flex items-center gap-3">
                            <img src={phoneIcon} alt="Telefone"/>
                            <span className="font-medium">0800 771 5055</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <img src={whatsappIcon} alt="WhatsApp" />
                            <span className="font-medium">Precisa de ajuda?</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
