import { ThemeCustomizer } from "@/components/settings/theme-customizer";

export default function SettingsPage() {
    return (
        <div className="space-y-6">
            <div className="pt-6">
                <h1 className="mb-2 font-serif text-3xl font-medium">Settings</h1>
                <p className="text-muted-foreground">Personalize your experience.</p>
            </div>
            <ThemeCustomizer />
        </div>
    );
}
