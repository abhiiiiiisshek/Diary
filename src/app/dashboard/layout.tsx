"use client";

import { useAuth } from "@/components/providers/auth-provider";
import { Navigation } from "@/components/layout/nav";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !user) {
            router.push("/");
        }
    }, [user, isLoading, router]);

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center bg-background">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="flex min-h-screen flex-col bg-background md:flex-row">
            <Navigation />
            <main className="flex-1 overflow-auto p-4 md:p-8">
                <div className="mx-auto max-w-4xl space-y-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
