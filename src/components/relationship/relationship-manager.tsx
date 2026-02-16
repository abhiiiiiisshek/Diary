"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Users, Copy, Check, Loader2, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function RelationshipManager() {
    const [inviteCode, setInviteCode] = useState<string | null>(null);
    const [partnerCode, setPartnerCode] = useState("");
    const [loading, setLoading] = useState(true);
    const [joining, setJoining] = useState(false);
    const [relationshipId, setRelationshipId] = useState<string | null>(null);
    const [partnerEmail, setPartnerEmail] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const supabase = createClient();

    useEffect(() => {
        const fetchStatus = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // Get profile for invite code
            const { data: profile } = await supabase
                .from("profiles")
                .select("invite_code")
                .eq("id", user.id)
                .single();

            if (profile) setInviteCode(profile.invite_code);

            // Check for existing relationship
            const { data: membership } = await supabase
                .from("relationship_members")
                .select("relationship_id")
                .eq("user_id", user.id)
                .single();

            if (membership) {
                setRelationshipId(membership.relationship_id);

                // Fetch partner info
                const { data: partners } = await supabase
                    .from("relationship_members")
                    .select("user_id, profiles(email)")
                    .eq("relationship_id", membership.relationship_id)
                    .neq("user_id", user.id) // Get the OTHER person
                    .single();

                if (partners?.profiles) {
                    // @ts-ignore
                    setPartnerEmail(partners.profiles.email);
                }
            }

            setLoading(false);
        };

        fetchStatus();
    }, [supabase]);

    const copyCode = () => {
        if (inviteCode) {
            navigator.clipboard.writeText(inviteCode);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleJoin = async (e: React.FormEvent) => {
        e.preventDefault();
        setJoining(true);
        setError(null);

        try {
            // 1. Find partner by invite code
            const { data: partnerProfile, error: profileError } = await supabase
                .from("profiles")
                .select("id")
                .eq("invite_code", partnerCode)
                .single();

            if (profileError || !partnerProfile) throw new Error("Invalid invite code");

            // 2. Create relationship
            const { data: newRel, error: relError } = await supabase
                .from("relationships")
                .insert({})
                .select("id")
                .single();

            if (relError || !newRel) throw new Error("Failed to create relationship");

            // 3. Add both users to relationship
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Not authenticated");

            const { error: memberError } = await supabase
                .from("relationship_members")
                .insert([
                    { relationship_id: newRel.id, user_id: user.id },
                    { relationship_id: newRel.id, user_id: partnerProfile.id }
                ]);

            if (memberError) throw new Error("Failed to join relationship");

            setRelationshipId(newRel.id);
            // Refresh to get partner email would be ideal, but for now just show success
            window.location.reload();

        } catch (err: any) {
            setError(err.message);
        } finally {
            setJoining(false);
        }
    };

    if (loading) {
        return <Loader2 className="animate-spin text-muted-foreground" />;
    }

    return (
        <div className="mx-auto max-w-2xl space-y-8">
            <div className="rounded-2xl border border-border bg-card p-8">
                <h2 className="mb-4 text-xl font-medium font-serif">Relationship Status</h2>

                {relationshipId ? (
                    <div className="flex items-center gap-4 rounded-lg bg-green-500/10 p-4 text-green-600">
                        <div className="rounded-full bg-green-500/20 p-2">
                            <Users size={20} />
                        </div>
                        <div>
                            <p className="font-medium">Connected</p>
                            <p className="text-sm opacity-80">
                                You are sharing entries with {partnerEmail || "your partner"}.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <p className="text-muted-foreground">
                            Connect with your partner to start sharing entries. You can either share your code or enter theirs.
                        </p>

                        <div className="grid gap-6 md:grid-cols-2">
                            {/* Your Code */}
                            <div className="space-y-2">
                                <label className="text-xs font-medium uppercase text-muted-foreground">Your Invite Code</label>
                                <div className="flex items-center gap-2">
                                    <code className="flex-1 rounded-lg bg-accent/10 px-4 py-3 font-mono text-lg font-bold tracking-wider text-accent-foreground">
                                        {inviteCode}
                                    </code>
                                    <button
                                        onClick={copyCode}
                                        className="rounded-lg border border-border p-3 hover:bg-muted transition-colors"
                                    >
                                        {copied ? <Check size={20} className="text-green-500" /> : <Copy size={20} />}
                                    </button>
                                </div>
                            </div>

                            {/* Enter Code */}
                            <form onSubmit={handleJoin} className="space-y-2">
                                <label className="text-xs font-medium uppercase text-muted-foreground">Enter Partner&apos;s Code</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={partnerCode}
                                        onChange={(e) => setPartnerCode(e.target.value)}
                                        placeholder="Paste code here"
                                        className="flex-1 rounded-lg border border-input bg-background px-4 py-3 font-mono text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                    />
                                    <button
                                        type="submit"
                                        disabled={joining || !partnerCode}
                                        className="rounded-lg bg-primary px-4 py-3 text-white disabled:opacity-50"
                                    >
                                        {joining ? <Loader2 size={20} className="animate-spin" /> : <ArrowRight size={20} />}
                                    </button>
                                </div>
                            </form>
                        </div>

                        {error && (
                            <p className="text-sm text-red-500">{error}</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
