'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

export default function AboutJetVideo() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [shouldLoad, setShouldLoad] = useState(false);

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setShouldLoad(true);
                    observer.disconnect();
                }
            },
            { rootMargin: '200px 0px' }
        );
        observer.observe(el);

        return () => observer.disconnect();
    }, []);

    return (
        <div ref={containerRef} className="relative w-full h-[60vh] sm:h-[70vh] overflow-hidden rounded-3xl">
            {shouldLoad && (
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="auto"
                    poster="/images/posters/about-jet-bg-poster.jpg"
                    className="absolute inset-0 w-full h-full object-cover"
                    src="/videos/about-jet-bg.mp4"
                />
            )}
            {!shouldLoad && (
                <Image
                    src="/images/posters/about-jet-bg-poster.jpg"
                    alt=""
                    fill
                    className="object-cover"
                    priority={false}
                />
            )}
        </div>
    );
}
