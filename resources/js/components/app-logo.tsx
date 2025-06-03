import AppLogoIcon from './app-logo-icon';

export default function AppLogo() {
    return (
        <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center">
                <AppLogoIcon className="h-full w-full" />
            </div>
            <div className="grid text-left">
                <span className="text-sm font-semibold">BRGY. CABCABON</span>
                <span className="text-sm font-semibold">SK - IRMS</span>
            </div>
        </div>
    );
}
