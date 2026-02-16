import { createClient } from "@/lib/supabase/server";
import { EntryEditor } from "@/components/diary/editor";
import { notFound, redirect } from "next/navigation";

export default async function EditEntryPage({ params }: { params: { id: string } }) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/");
    }

    const { data: entry } = await supabase
        .from("entries")
        .select("*")
        .eq("id", params.id)
        .single();

    if (!entry) {
        notFound();
    }

    // Basic permission check (RLS handles the real security, but good for UX)
    if (entry.user_id !== user.id && entry.is_private) {
        // If it's private and not yours, you shouldn't see it (RLS would return null/error)
        notFound();
    }

    return (
        <div className="space-y-6">
            <div className="mx-auto max-w-3xl pt-6">
                <h1 className="mb-2 font-serif text-3xl font-medium">
                    {new Date(entry.created_at).toLocaleDateString(undefined, {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })}
                </h1>
                <p className="text-muted-foreground">
                    {new Date(entry.created_at).toLocaleTimeString(undefined, {
                        hour: '2-digit',
                        minute: '2-digit'
                    })}
                </p>
            </div>
            <EntryEditor
                initialContent={entry.content}
                initialId={entry.id}
                initialIsPrivate={entry.is_private}
            />
        </div>
    );
}
