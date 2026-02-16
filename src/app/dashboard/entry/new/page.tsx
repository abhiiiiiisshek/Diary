import { EntryEditor } from "@/components/diary/editor";

export default function NewEntryPage() {
    return (
        <div className="space-y-6">
            <div className="mx-auto max-w-3xl pt-6">
                <h1 className="mb-2 font-serif text-3xl font-medium">New Entry</h1>
                <p className="text-muted-foreground">Capture the moment.</p>
            </div>
            <EntryEditor />
        </div>
    );
}
