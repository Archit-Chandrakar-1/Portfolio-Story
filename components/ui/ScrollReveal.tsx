'use client';
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface ScrollRevealProps {
    children: React.ReactNode;
    delay?: number;
    direction?: 'up' | 'down' | 'left' | 'right' | 'none';
    className?: string;
    once?: boolean;
}

const directionMap = {
    up: { y: 40, x: 0 },
    down: { y: -40, x: 0 },
    left: { x: 40, y: 0 },
    right: { x: -40, y: 0 },
    none: { x: 0, y: 0 },
};

export default function ScrollReveal({
    children,
    delay = 0,
    direction = 'up',
    className = '',
    once = true,
}: ScrollRevealProps) {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once, margin: '-60px 0px' });
    const initial = { opacity: 0, ...directionMap[direction] };

    return (
        <motion.div
            ref={ref}
            initial={initial}
            animate={inView ? { opacity: 1, x: 0, y: 0 } : initial}
            transition={{ duration: 0.65, delay, ease: [0.25, 0.1, 0.25, 1] }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
