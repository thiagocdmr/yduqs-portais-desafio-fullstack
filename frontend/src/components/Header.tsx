import estacioLogo from '../assets/logos/estacio_black_logo.svg';

export default function Header() {
    return (
        <header>
            <div className="max-w-[1366px] mx-auto py-6">
                <div className="flex items-center">
                    <img 
                        src={estacioLogo} 
                        alt="Logo Estácio" 
                    />
                </div>
            </div>
        </header>
    );
}
