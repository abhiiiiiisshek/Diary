import { RelationshipManager } from "@/components/relationship/relationship-manager";

export default function RelationshipPage() {
    return (
        <div className="space-y-6">
            <div className="pt-6">
                <h1 className="mb-2 font-serif text-3xl font-medium">Relationship</h1>
                <p className="text-muted-foreground">Manage your connection.</p>
            </div>
            <RelationshipManager />
        </div>
    );
}
