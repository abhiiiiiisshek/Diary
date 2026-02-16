"use client";

import { EntryList } from "@/components/diary/entry-list";
import { useAuth } from "@/components/providers/auth-provider";
import Link from "next/link";
import { Plus } from "lucide-react";

export default function DashboardPage() {
    const { user } = useAuth();

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-serif text-3xl font-medium text-foreground">
                        Good {new Date().getHours() < 12 ? "morning" : new Date().getHours() < 18 ? "afternoon" : "evening"},
                    </h1>
                    {/* We might want to store/display user name, but sticking to minimalist for now */}
                    <p className="mt-1 text-muted-foreground">Ready to write?</p>
                </div>

                <Link
                    href="/dashboard/entry/new"
                    className="group flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
                >
                    <Plus size={18} className="transition-transform group-hover:rotate-90" />
                    <span>New Entry</span>
                </Link>
            </div>

            <EntryList />
        </div>
    );
}
