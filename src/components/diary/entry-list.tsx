"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { motion } from "framer-motion";
import Link from "next/link";
import { format } from "date-fns";
import { Plus, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Entry {
    id: string;
    content: string;
    created_at: string;
    is_private: boolean;
    word_count: number;
}

export function EntryList() {
    const [entries, setEntries] = useState<Entry[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        const fetchEntries = async () => {
            const { data, error } = await supabase
                .from("entries")
                .select("id, content, created_at, is_private, word_count")
                .order("created_at", { ascending: false });

            if (data) {
                setEntries(data);
            }
            setLoading(false);
        };

        fetchEntries();
    }, [supabase]);

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (entries.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border p-12 text-center">
                <h3 className="text-xl font-medium text-foreground">No entries yet</h3>
                <p className="mt-2 text-muted-foreground">Start writing your story today.</p>
                <Link
                    href="/dashboard/entry/new"
                    className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-white transition-transform hover:scale-105 active:scale-95"
                >
                    <Plus size={18} />
                    Create First Entry
                </Link>
            </div>
        );
    }

    return (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {entries.map((entry, index) => (
                <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                >
                    <Link href={`/dashboard/entry/${entry.id}`}>
                        <div className="group relative h-full overflow-hidden rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg">
                            <div className="mb-4 flex items-center justify-between">
                                <span className="text-xs font-medium text-muted-foreground">
                                    {format(new Date(entry.created_at), "MMM d, yyyy")}
                                </span>
                                {entry.is_private && (
                                    <span className="rounded-full bg-background/50 px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                                        Private
                                    </span>
                                )}
                            </div>

                            <div className="line-clamp-4 text-sm leading-relaxed text-foreground/80 group-hover:text-foreground">
                                {entry.content}
                            </div>

                            <div className="mt-4 flex items-center gap-2 text-[10px] text-muted-foreground">
                                <span>{format(new Date(entry.created_at), "h:mm a")}</span>
                                <span>•</span>
                                <span>{entry.word_count || 0} words</span>
                            </div>
                        </div>
                    </Link>
                </motion.div>
            ))}
        </div>
    );
}
