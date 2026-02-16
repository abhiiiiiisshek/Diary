"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useAuth } from "./auth-provider";
import { createClient } from "@/lib/supabase/client";

interface ThemeConfig {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    foreground: string;
    radius: string;
    font: string;
}

const defaultTheme: ThemeConfig = {
    primary: "255 100 100",
    secondary: "40 40 50",
    accent: "255 200 100",
    background: "10 10 15",
    foreground: "250 250 250",
    radius: "0.75rem",
    font: "Inter",
};

interface ThemeContextType {
    theme: ThemeConfig;
    updateTheme: (newTheme: Partial<ThemeConfig>) => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType>({
    theme: defaultTheme,
    updateTheme: async () => { },
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const { user } = useAuth();
    const [theme, setTheme] = useState<ThemeConfig>(defaultTheme);
    const supabase = createClient();

    // Load theme from DB when user logs in
    useEffect(() => {
        if (!user) return;

        const fetchTheme = async () => {
            const { data, error } = await supabase
                .from("themes")
                .select("config")
                .eq("user_id", user.id)
                .single();

            if (data?.config) {
                setTheme((prev) => ({ ...prev, ...data.config }));
            }
        };

        fetchTheme();
    }, [user, supabase]);

    // Apply theme to CSS variables
    useEffect(() => {
        const root = document.documentElement;

        // Helper to set variable
        const setVar = (name: string, value: string) => {
            root.style.setProperty(`--${name}`, value);
        };

        setVar("primary", theme.primary);
        setVar("secondary", theme.secondary);
        setVar("accent", theme.accent);
        setVar("background", theme.background);
        setVar("foreground", theme.foreground);
        setVar("radius", theme.radius);
        // Font handling might require loading fonts or mapping names to stacks
        // simpler for now:
        if (theme.font === 'Inter') {
            root.style.setProperty('--font-sans', 'Inter, sans-serif');
        } else if (theme.font === 'Serif') {
            root.style.setProperty('--font-sans', 'Playfair Display, serif');
        }

    }, [theme]);

    const updateTheme = async (newTheme: Partial<ThemeConfig>) => {
        const updated = { ...theme, ...newTheme };
        setTheme(updated);

        if (user) {
            // Debounce or just save
            await supabase
                .from("themes")
                .upsert({ user_id: user.id, config: updated, updated_at: new Date().toISOString() });
        }
    };

    return (
        <ThemeContext.Provider value={{ theme, updateTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
