'use client';
import { useEffect, useRef, useState } from 'react';

const SPOTLIGHT_R = 220;
const BASE_IMAGE = '/images/footer-reveal-base.webp';
const REVEAL_IMAGE = '/images/footer-reveal-glow.webp';

function RevealLayer({
    image,
    cursorX,
    cursorY,
    size,
}: {
    image: string;
    cursorX: number;
    cursorY: number;
    size: { w: number; h: number };
}) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [maskUrl, setMaskUrl] = useState<string | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || size.w === 0 || size.h === 0) return;
        canvas.width = size.w;
        canvas.height = size.h;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const gradient = ctx.createRadialGradient(cursorX, cursorY, 0, cursorX, cursorY, SPOTLIGHT_R);
        gradient.addColorStop(0, 'rgba(255,255,255,1)');
        gradient.addColorStop(0.4, 'rgba(255,255,255,1)');
        gradient.addColorStop(0.6, 'rgba(255,255,255,0.75)');
        gradient.addColorStop(0.75, 'rgba(255,255,255,0.4)');
        gradient.addColorStop(0.88, 'rgba(255,255,255,0.12)');
        gradient.addColorStop(1, 'rgba(255,255,255,0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(cursorX, cursorY, SPOTLIGHT_R, 0, Math.PI * 2);
        ctx.fill();

        setMaskUrl(canvas.toDataURL());
    }, [cursorX, cursorY, size]);

    return (
        <>
            <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" style={{ display: 'none' }} />
            <div
                className="absolute inset-0 bg-center bg-cover bg-no-repeat pointer-events-none"
                style={{
                    backgroundImage: `url(${image})`,
                    WebkitMaskImage: maskUrl ? `url(${maskUrl})` : undefined,
                    maskImage: maskUrl ? `url(${maskUrl})` : undefined,
                    WebkitMaskSize: '100% 100%',
                    maskSize: '100% 100%',
                }}
            />
        </>
    );
}

export default function FooterRevealBackground() {
    const containerRef = useRef<HTMLDivElement>(null);
    const mouse = useRef({ x: -999, y: -999 });
    const smooth = useRef({ x: -999, y: -999 });
    const rafRef = useRef<number>(0);
    const [cursorPos, setCursorPos] = useState({ x: -999, y: -999 });
    const [size, setSize] = useState({ w: 0, h: 0 });

    useEffect(() => {
        const updateSize = () => {
            const el = containerRef.current;
            if (el) setSize({ w: el.offsetWidth, h: el.offsetHeight });
        };
        updateSize();
        window.addEventListener('resize', updateSize);

        const handleMove = (e: MouseEvent) => {
            const el = containerRef.current;
            if (!el) return;
            const rect = el.getBoundingClientRect();
            mouse.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
        };
        window.addEventListener('mousemove', handleMove);

        const loop = () => {
            smooth.current.x += (mouse.current.x - smooth.current.x) * 0.1;
            smooth.current.y += (mouse.current.y - smooth.current.y) * 0.1;
            setCursorPos({ x: smooth.current.x, y: smooth.current.y });
            rafRef.current = requestAnimationFrame(loop);
        };
        rafRef.current = requestAnimationFrame(loop);

        return () => {
            window.removeEventListener('resize', updateSize);
            window.removeEventListener('mousemove', handleMove);
            cancelAnimationFrame(rafRef.current);
        };
    }, []);

    return (
        <div ref={containerRef} className="absolute inset-0 overflow-hidden">
            <div
                className="absolute inset-0 bg-center bg-cover bg-no-repeat"
                style={{ backgroundImage: `url(${BASE_IMAGE})` }}
            />
            <RevealLayer image={REVEAL_IMAGE} cursorX={cursorPos.x} cursorY={cursorPos.y} size={size} />
            <div className="absolute inset-0 bg-navy/75" />
        </div>
    );
}
