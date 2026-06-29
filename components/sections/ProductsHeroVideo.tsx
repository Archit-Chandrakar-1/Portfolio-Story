'use client';
import { useEffect, useRef } from 'react';

export default function ProductsHeroVideo() {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        let prevX = 0;
        let hasPrevX = false;
        let isSeeking = false;

        const onSeeked = () => {
            isSeeking = false;
        };

        const onMouseMove = (e: MouseEvent) => {
            if (window.innerWidth < 1024) return;
            if (!hasPrevX) {
                prevX = e.clientX;
                hasPrevX = true;
                return;
            }
            const delta = e.clientX - prevX;
            prevX = e.clientX;

            const duration = video.duration;
            if (!duration || isNaN(duration)) return;

            let targetTime = video.currentTime + (delta / window.innerWidth) * 0.8 * duration;
            targetTime = Math.max(0, Math.min(duration, targetTime));

            isSeeking = true;
            video.currentTime = targetTime;
        };

        const setupForViewport = () => {
            if (window.innerWidth < 1024) {
                video.autoplay = true;
                video.play().catch(() => {});
            } else {
                video.pause();
            }
        };

        video.addEventListener('seeked', onSeeked);
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('resize', setupForViewport);
        setupForViewport();

        return () => {
            video.removeEventListener('seeked', onSeeked);
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('resize', setupForViewport);
        };
    }, []);

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none w-full h-full bg-bg">
            <video
                ref={videoRef}
                muted
                playsInline
                preload="auto"
                poster="/images/posters/products-hero-scrub-poster.jpg"
                className="w-full h-full object-cover object-right lg:object-right-bottom"
                src="/videos/products-hero-scrub.mp4"
            />
        </div>
    );
}
