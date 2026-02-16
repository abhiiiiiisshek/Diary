"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Book, Settings, LogOut, Menu, X, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/providers/auth-provider";
import { useState } from "react";

const navItems = [
    { href: "/dashboard", icon: Book, label: "Diary" },
    { href: "/dashboard/relationship", icon: Users, label: "Relationship" },
    { href: "/dashboard/settings", icon: Settings, label: "Settings" },
];

export function Navigation() {
    const pathname = usePathname();
    const { signOut } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <>
            {/* Mobile Header */}
            <div className="flex items-center justify-between border-b border-border bg-card p-4 md:hidden">
                <span className="font-serif text-xl font-medium">DualDiary</span>
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="p-2 text-muted-foreground hover:text-foreground"
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Sidebar / Desktop Nav */}
            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-40 w-64 transform border-r border-border bg-card transition-transform duration-300 ease-in-out md:translate-x-0",
                    isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:relative md:translate-x-0"
                )}
            >
                <div className="flex h-full flex-col p-6">
                    <div className="mb-8 hidden px-2 md:block">
                        <h1 className="font-serif text-2xl font-bold">DualDiary</h1>
                    </div>

                    <nav className="flex-1 space-y-2">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            const Icon = item.icon;

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={cn(
                                        "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                                        isActive
                                            ? "bg-primary/10 text-primary"
                                            : "text-muted-foreground hover:bg-accent/10 hover:text-foreground"
                                    )}
                                >
                                    <Icon size={20} />
                                    <span>{item.label}</span>
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeNav"
                                            className="absolute left-0 h-full w-1 bg-primary rounded-r-full"
                                        />
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="border-t border-border pt-6">
                        <button
                            onClick={() => signOut()}
                            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-red-500/10 hover:text-red-500"
                        >
                            <LogOut size={20} />
                            <span>Sign Out</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Overlay for mobile */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm md:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}
        </>
    );
}
