"use client";

import { useTheme } from "@/components/providers/theme-provider";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const colors = [
    { name: "Default Red", value: "255 100 100" },
    { name: "Ocean Blue", value: "56 189 248" },
    { name: "Emerald Green", value: "52 211 153" },
    { name: "Amber Gold", value: "251 191 36" },
    { name: "Violet Purple", value: "167 139 250" },
    { name: "Rose Pink", value: "251 113 133" },
];

const bgs = [
    { name: "Midnight", value: "10 10 15" },
    { name: "Deep Space", value: "15 23 42" },
    { name: "Forest Night", value: "2 44 34" },
    { name: "Slate", value: "30 41 59" },
];

const fonts = [
    { name: "Modern Sans", value: "Inter" },
    { name: "Elegant Serif", value: "Serif" },
];

const radii = [
    { name: "Sharp", value: "0rem" },
    { name: "Slight", value: "0.25rem" },
    { name: "Standard", value: "0.5rem" },
    { name: "Rounded", value: "0.75rem" },
    { name: "Pill", value: "1.5rem" },
];

export function ThemeCustomizer() {
    const { theme, updateTheme } = useTheme();

    return (
        <div className="space-y-8 rounded-2xl border border-border bg-card p-8">
            <div>
                <h2 className="mb-4 text-xl font-medium font-serif">Appearance</h2>
                <p className="text-sm text-muted-foreground mb-6">Customize the look and feel of your diary.</p>
            </div>

            {/* Primary Color */}
            <div className="space-y-3">
                <label className="text-sm font-medium">Accent Color</label>
                <div className="flex flex-wrap gap-3">
                    {colors.map((color) => (
                        <button
                            key={color.name}
                            onClick={() => updateTheme({ primary: color.value, ring: color.value })}
                            className={cn(
                                "group relative h-10 w-10 rounded-full border border-border transition-transform active:scale-95",
                                theme.primary === color.value && "ring-2 ring-primary ring-offset-2 ring-offset-background"
                            )}
                            style={{ backgroundColor: `rgb(${color.value})` }}
                            title={color.name}
                        >
                            {theme.primary === color.value && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Check size={16} className="text-white drop-shadow-md" />
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Background Color */}
            <div className="space-y-3">
                <label className="text-sm font-medium">Background Tone</label>
                <div className="flex flex-wrap gap-3">
                    {bgs.map((bg) => (
                        <button
                            key={bg.name}
                            onClick={() => updateTheme({ background: bg.value, card: bg.value === "10 10 15" ? "20 20 25" : bg.value })} // Simple logic for card bg contrast
                            className={cn(
                                "group relative h-12 w-12 rounded-lg border border-border transition-transform active:scale-95",
                                theme.background === bg.value && "ring-2 ring-primary ring-offset-2 ring-offset-background"
                            )}
                            style={{ backgroundColor: `rgb(${bg.value})` }}
                            title={bg.name}
                        >
                            {theme.background === bg.value && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Check size={16} className="text-white" />
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Font Family */}
            <div className="space-y-3">
                <label className="text-sm font-medium">Typography</label>
                <div className="flex gap-3">
                    {fonts.map((font) => (
                        <button
                            key={font.name}
                            onClick={() => updateTheme({ font: font.value })}
                            className={cn(
                                "px-4 py-2 rounded-lg border border-input transition-all hover:bg-accent/10",
                                theme.font === font.value ? "border-primary bg-primary/5 text-primary" : "text-muted-foreground"
                            )}
                        >
                            <span className={font.value === "Inter" ? "font-sans" : "font-serif"}>
                                {font.name}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Radius */}
            <div className="space-y-3">
                <label className="text-sm font-medium">Corner Radius</label>
                <div className="flex flex-wrap gap-2">
                    {radii.map((radius) => (
                        <button
                            key={radius.name}
                            onClick={() => updateTheme({ radius: radius.value })}
                            className={cn(
                                "px-3 py-1.5 text-xs rounded-md border border-input transition-all hover:bg-accent/10",
                                theme.radius === radius.value ? "border-primary bg-primary/5 text-primary" : "text-muted-foreground"
                            )}
                        >
                            {radius.name}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
