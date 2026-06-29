'use client';
import { useEffect, useRef } from 'react';

const SPOTLIGHT_R = 220;
const BASE_IMAGE = '/images/footer-reveal-base.webp';
const REVEAL_IMAGE = '/images/footer-reveal-glow.webp';
const SETTLE_EPSILON = 0.05;

// Same gradient stops as the old canvas version, just expressed as a CSS
// radial-gradient mask instead of a rasterized canvas->toDataURL() PNG.
function buildMask(x: number, y: number) {
    return `radial-gradient(circle ${SPOTLIGHT_R}px at ${x}px ${y}px, ` +
        `rgba(255,255,255,1) 0%, rgba(255,255,255,1) 40%, ` +
        `rgba(255,255,255,0.75) 60%, rgba(255,255,255,0.4) 75%, ` +
        `rgba(255,255,255,0.12) 88%, rgba(255,255,255,0) 100%)`;
}

export default function FooterRevealBackground() {
    const containerRef = useRef<HTMLDivElement>(null);
    const revealRef = useRef<HTMLDivElement>(null);
    const mouse = useRef({ x: -999, y: -999 });
    const smooth = useRef({ x: -999, y: -999 });
    const rafRef = useRef<number | null>(null);
    const inViewRef = useRef(false);

    useEffect(() => {
        const container = containerRef.current;
        const revealEl = revealRef.current;
        if (!container || !revealEl) return;

        const applyMask = (x: number, y: number) => {
            const mask = buildMask(x, y);
            revealEl.style.maskImage = mask;
            revealEl.style.WebkitMaskImage = mask;
        };

        // Start fully masked-out, matching the original's initial {x:-999,y:-999}.
        applyMask(smooth.current.x, smooth.current.y);

        const stepLoop = () => {
            const dx = mouse.current.x - smooth.current.x;
            const dy = mouse.current.y - smooth.current.y;
            smooth.current.x += dx * 0.1;
            smooth.current.y += dy * 0.1;
            applyMask(smooth.current.x, smooth.current.y);

            // Once settled, stop the RAF loop entirely instead of running forever;
            // the next mousemove (while in view) restarts it.
            if (Math.abs(dx) > SETTLE_EPSILON || Math.abs(dy) > SETTLE_EPSILON) {
                rafRef.current = requestAnimationFrame(stepLoop);
            } else {
                rafRef.current = null;
            }
        };

        const ensureLoopRunning = () => {
            if (rafRef.current === null && inViewRef.current) {
                rafRef.current = requestAnimationFrame(stepLoop);
            }
        };

        const handleMove = (e: MouseEvent) => {
            const rect = container.getBoundingClientRect();
            mouse.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
            ensureLoopRunning();
        };
        window.addEventListener('mousemove', handleMove);

        // Only animate while the footer is actually in the viewport.
        const observer = new IntersectionObserver(
            ([entry]) => {
                inViewRef.current = entry.isIntersecting;
                if (entry.isIntersecting) ensureLoopRunning();
            },
            { threshold: 0 }
        );
        observer.observe(container);

        return () => {
            window.removeEventListener('mousemove', handleMove);
            observer.disconnect();
            if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
        };
    }, []);

    return (
        <div ref={containerRef} className="absolute inset-0 overflow-hidden">
            <div
                className="absolute inset-0 bg-center bg-cover bg-no-repeat"
                style={{ backgroundImage: `url(${BASE_IMAGE})` }}
            />
            <div
                ref={revealRef}
                className="absolute inset-0 bg-center bg-cover bg-no-repeat pointer-events-none"
                style={{ backgroundImage: `url(${REVEAL_IMAGE})` }}
            />
            <div className="absolute inset-0 bg-navy/75" />
        </div>
    );
}
