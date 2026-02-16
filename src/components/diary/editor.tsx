"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Loader2, Save, Trash2, Lock, Globe, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface EditorProps {
    initialContent?: string;
    initialId?: string;
    initialIsPrivate?: boolean;
}

export function EntryEditor({ initialContent = "", initialId, initialIsPrivate = false }: EditorProps) {
    const [content, setContent] = useState(initialContent);
    const [isPrivate, setIsPrivate] = useState(initialIsPrivate);
    const [isSaving, setIsSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const [entryId, setEntryId] = useState(initialId);
    const [wordCount, setWordCount] = useState(0);
    const [charCount, setCharCount] = useState(0);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const supabase = createClient();
    const router = useRouter();

    // Stats calculation
    useEffect(() => {
        const words = content.trim().split(/\s+/).filter((w) => w.length > 0).length;
        setWordCount(words);
        setCharCount(content.length);
    }, [content]);

    // Debounced Auto-save
    useEffect(() => {
        if (content === initialContent && isPrivate === initialIsPrivate && !entryId) return;

        const timeout = setTimeout(async () => {
            setIsSaving(true);

            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const entryData = {
                content,
                is_private: isPrivate,
                word_count: wordCount,
                character_count: charCount,
                user_id: user.id,
                updated_at: new Date().toISOString(),
            };

            if (entryId) {
                await supabase.from("entries").update(entryData).eq("id", entryId);
            } else {
                // Create new
                const { data, error } = await supabase
                    .from("entries")
                    .insert(entryData)
                    .select("id")
                    .single();

                if (data && !error) {
                    setEntryId(data.id);
                    // Update URL without reload if desired
                    window.history.replaceState(null, "", `/dashboard/entry/${data.id}`);
                }
            }

            setLastSaved(new Date());
            setIsSaving(false);
        }, 1500); // 1.5s debounce

        return () => clearTimeout(timeout);
    }, [content, isPrivate, entryId, wordCount, charCount, supabase]);

    const handleDelete = async () => {
        if (!entryId) return;
        setIsSaving(true);
        await supabase.from("entries").delete().eq("id", entryId);
        router.push("/dashboard");
    };

    return (
        <div className="mx-auto max-w-3xl">
            <div className="mb-6 flex items-center justify-between">
                <Link
                    href="/dashboard"
                    className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                    <ChevronLeft size={16} />
                    Back
                </Link>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        {isSaving ? (
                            <span className="flex items-center gap-1">
                                <Loader2 size={12} className="animate-spin" />
                                Saving...
                            </span>
                        ) : lastSaved ? (
                            <span className="flex items-center gap-1 text-green-500">
                                <Save size={12} />
                                Saved {lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        ) : null}
                    </div>

                    <button
                        onClick={() => setIsPrivate(!isPrivate)}
                        className={cn(
                            "flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                            isPrivate
                                ? "bg-primary/10 text-primary"
                                : "bg-accent/10 text-accent-foreground" // using accent-foreground if defined, or similar
                        )}
                        title={isPrivate ? "Private: Visible only to you" : "Shared: Visible to relationship"}
                    >
                        {isPrivate ? <Lock size={12} /> : <Globe size={12} />}
                        {isPrivate ? "Private" : "Shared"}
                    </button>

                    {entryId && (
                        <div className="relative">
                            {showDeleteConfirm ? (
                                <div className="absolute right-0 top-0 z-10 flex items-center gap-2 rounded-lg border border-border bg-card p-1 shadow-lg">
                                    <button
                                        onClick={handleDelete}
                                        className="rounded-md bg-red-500 px-3 py-1 text-xs text-white hover:bg-red-600"
                                    >
                                        Confirm
                                    </button>
                                    <button
                                        onClick={() => setShowDeleteConfirm(false)}
                                        className="px-2 text-xs text-muted-foreground hover:text-foreground"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setShowDeleteConfirm(true)}
                                    className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-red-500/10 hover:text-red-500"
                                >
                                    <Trash2 size={16} />
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <div className="relative min-h-[60vh] rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-10">
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="What's on your mind?"
                    className="h-full min-h-[50vh] w-full resize-none border-none bg-transparent text-lg leading-relaxed text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:ring-0 sm:text-xl font-serif"
                    spellCheck={false}
                />

                <div className="absolute bottom-4 right-6 flex gap-4 text-xs text-muted-foreground opacity-50 transition-opacity hover:opacity-100">
                    <span>{wordCount} words</span>
                    <span>{charCount} chars</span>
                </div>
            </div>
        </div>
    );
}
