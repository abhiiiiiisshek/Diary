"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AuthModal } from "@/components/auth/auth-modal";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

export function Hero() {
    const containerRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const subtitleRef = useRef<HTMLParagraphElement>(null);
    const ctaRef = useRef<HTMLButtonElement>(null);
    const [isAuthOpen, setIsAuthOpen] = useState(false);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline();

            // Text Reveal Animation
            tl.fromTo(
                ".char",
                { y: 100, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    stagger: 0.05,
                    duration: 1,
                    ease: "power4.out",
                }
            )
                .fromTo(
                    subtitleRef.current,
                    { y: 20, opacity: 0 },
                    { y: 0, opacity: 1, duration: 1, ease: "power3.out" },
                    "-=0.5"
                )
                .fromTo(
                    ctaRef.current,
                    { scale: 0.9, opacity: 0 },
                    { scale: 1, opacity: 1, duration: 0.8, ease: "back.out(1.7)" },
                    "-=0.5"
                );

            // Parallax Effect on Mouse Move
            containerRef.current?.addEventListener("mousemove", (e) => {
                const { clientX, clientY } = e;
                const x = (clientX / window.innerWidth - 0.5) * 20;
                const y = (clientY / window.innerHeight - 0.5) * 20;

                gsap.to(".floating-element", {
                    x: x,
                    y: y,
                    duration: 1,
                    ease: "power2.out",
                });
            });

        }, containerRef);

        return () => ctx.revert();
    }, []);

    // Split text helper
    const splitText = (text: string) => {
        return text.split("").map((char, index) => (
            <span key={index} className="char inline-block" style={{ minWidth: char === " " ? "0.3em" : "auto" }}>
                {char}
            </span>
        ));
    };

    return (
        <div ref={containerRef} className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4">
            {/* Background Elements */}
            <div className="floating-element absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-primary/10 blur-[100px]" />
            <div className="floating-element absolute bottom-1/4 right-1/4 h-64 w-64 rounded-full bg-accent/10 blur-[100px]" />

            <div className="relative z-10 flex max-w-4xl flex-col items-center text-center">
                <h1 ref={titleRef} className="text-6xl font-bold tracking-tight text-foreground sm:text-8xl font-serif">
                    <div className="overflow-hidden p-2">
                        {splitText("DualDiary")}
                    </div>
                </h1>

                <p ref={subtitleRef} className="mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl font-light">
                    A private, shared sanctuary for two.
                    Capture moments, share thoughts, and build your story together in a distraction-free space.
                </p>

                <button
                    ref={ctaRef}
                    onClick={() => setIsAuthOpen(true)}
                    className="group mt-10 relative overflow-hidden rounded-full bg-foreground px-8 py-4 text-background transition-all hover:scale-105 active:scale-95"
                >
                    <span className="relative z-10 font-bold tracking-wide">Start Writing</span>
                    <div className="absolute inset-0 z-0 bg-gradient-to-r from-primary via-accent to-primary opacity-0 transition-opacity group-hover:opacity-20" />
                </button>
            </div>

            <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
        </div>
    );
}
