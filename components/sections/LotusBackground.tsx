'use client';
import { useEffect, useRef } from 'react';

export default function LotusBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let particles: { x: number; y: number; vx: number; vy: number; size: number; opacity: number }[] = [];
        let frameId: number;

        const resize = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
            const count = Math.floor((canvas.width * canvas.height) / 12000);
            particles = Array.from({ length: count }, () => ({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.2,
                vy: (Math.random() - 0.5) * 0.2,
                size: Math.random() * 1.4 + 0.4,
                opacity: Math.random() * 0.5 + 0.15,
            }));
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (const p of particles) {
                p.x += p.vx;
                p.y += p.vy;
                if (p.x < 0) p.x = canvas.width;
                if (p.x > canvas.width) p.x = 0;
                if (p.y < 0) p.y = canvas.height;
                if (p.y > canvas.height) p.y = 0;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255,255,255,${p.opacity})`;
                ctx.fill();
            }
            frameId = requestAnimationFrame(animate);
        };

        resize();
        animate();
        window.addEventListener('resize', resize);
        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(frameId);
        };
    }, []);

    return (
        <div className="absolute inset-0 overflow-hidden bg-navy-dark">
            <video
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                poster="/images/posters/lotus-hero-bg-poster.jpg"
                className="absolute inset-0 w-full h-full object-cover"
                src="/videos/lotus-hero-bg.mp4"
            />
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/85 via-navy-dark/30 to-navy-dark/60" />
        </div>
    );
}
