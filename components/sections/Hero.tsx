'use client';
import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { RiArrowDownLine, RiLinkedinFill, RiTwitterXFill, RiInstagramLine, RiGithubFill, RiWhatsappLine, RiMediumLine, RiExternalLinkLine } from 'react-icons/ri';
import { AboutData } from '@/lib/firestore';

const TITLES = [
    'Product Manager',
    'Strategy Thinker',
    'User Advocate',
    'Builder of Products',
];

function TypewriterText({ texts }: { texts: string[] }) {
    const [index, setIndex] = useState(0);
    const [displayed, setDisplayed] = useState('');
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        const target = texts[index];
        let timeout: ReturnType<typeof setTimeout>;

        if (!deleting && displayed.length < target.length) {
            timeout = setTimeout(() => setDisplayed(target.slice(0, displayed.length + 1)), 80);
        } else if (!deleting && displayed.length === target.length) {
            timeout = setTimeout(() => setDeleting(true), 2200);
        } else if (deleting && displayed.length > 0) {
            timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 40);
        } else if (deleting && displayed.length === 0) {
            setDeleting(false);
            setIndex((i) => (i + 1) % texts.length);
        }

        return () => clearTimeout(timeout);
    }, [displayed, deleting, index, texts]);

    return (
        <span className="text-navy">
            {displayed}
            <span className="animate-pulse text-lime">|</span>
        </span>
    );
}

const SOCIALS = [
    { icon: RiLinkedinFill, href: 'https://linkedin.com', label: 'LinkedIn' },
    { icon: RiTwitterXFill, href: 'https://twitter.com', label: 'Twitter' },
    { icon: RiWhatsappLine, href: 'https://wa.me/91XXXXXXXXXX', label: 'WhatsApp' },
    { icon: RiMediumLine, href: 'https://medium.com', label: 'Medium' },
    { icon: RiExternalLinkLine, href: 'https://topmate.io', label: 'Topmate' },
    { icon: RiInstagramLine, href: 'https://instagram.com', label: 'Instagram' },
    { icon: RiGithubFill, href: 'https://github.com', label: 'GitHub' },
];

interface HeroProps {
    about: AboutData | null;
}

export default function Hero({ about }: HeroProps) {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
    const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
    const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

    const name = about?.name || 'Archit Chandrakar';
    const subHeadline = about?.subHeadline || 'Turning complex problems into elegant products.';

    const container = {
        hidden: {},
        show: { transition: { staggerChildren: 0.12, delayChildren: 0.3 } },
    };
    const item = {
        hidden: { opacity: 0, y: 30 },
        show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] } },
    };

    return (
        <section ref={ref} className="relative min-h-screen flex items-center overflow-hidden animated-gradient-bg">
            {/* Decorative blobs */}
            <div className="absolute top-1/4 -left-40 w-[500px] h-[500px] bg-lime/25 blob pointer-events-none" />
            <div className="absolute bottom-1/4 -right-40 w-[450px] h-[450px] bg-mint/40 blob pointer-events-none" style={{ animationDelay: '3s' }} />
            <div className="absolute top-2/3 left-1/3 w-72 h-72 bg-lime/15 blob pointer-events-none" style={{ animationDelay: '6s' }} />

            {/* Dot grid overlay */}
            <div className="absolute inset-0 dot-pattern pointer-events-none opacity-60" />

            {/* Scroll-parallax wrapper */}
            <motion.div style={{ y, opacity }} className="relative z-10 w-full">
                <div className="max-w-7xl mx-auto px-6 pt-28 pb-20">
                    <motion.div variants={container} initial="hidden" animate="show" className="max-w-4xl">
                        {/* Badge */}
                        <motion.div variants={item} className="inline-flex items-center gap-2 mb-6">
                            <span className="bg-lime/30 border border-lime/60 text-navy text-xs font-semibold px-4 py-1.5 rounded-full tracking-wider uppercase">
                                ✦ Product Manager
                            </span>
                        </motion.div>

                        {/* Name */}
                        <motion.h1 variants={item} className="font-display font-black text-5xl sm:text-6xl lg:text-8xl text-navy leading-[1.05] mb-4">
                            {name.split(' ').map((word, i) => (
                                <span key={i} className={i === 1 ? 'relative inline-block' : ''}>
                                    {i === 1 ? (
                                        <>
                                            <span className="relative">
                                                {word}
                                                <span className="absolute -bottom-2 left-0 right-0 h-3 bg-lime/40 -skew-x-2 -z-10 rounded" />
                                            </span>
                                        </>
                                    ) : word}
                                    {' '}
                                </span>
                            ))}
                        </motion.h1>

                        {/* Typewriter */}
                        <motion.div variants={item} className="font-display font-semibold text-2xl sm:text-3xl lg:text-4xl mb-6 h-12 flex items-center">
                            <TypewriterText texts={TITLES} />
                        </motion.div>

                        {/* Sub-headline */}
                        <motion.p variants={item} className="text-text-secondary text-lg sm:text-xl leading-relaxed max-w-2xl mb-10">
                            {subHeadline}
                        </motion.p>

                        {/* CTAs */}
                        <motion.div variants={item} className="flex flex-wrap gap-4 mb-12">
                            <Link href="/products" className="btn-primary px-8 py-3.5 text-base rounded-2xl">
                                View My Work
                            </Link>
                            <Link href="/about" className="btn-secondary px-8 py-3.5 text-base rounded-2xl">
                                About Me
                            </Link>
                        </motion.div>

                        {/* Socials */}
                        <motion.div variants={item} className="flex items-center gap-4">
                            <span className="text-text-muted text-sm">Find me on</span>
                            <div className="h-px w-8 bg-border" />
                            <div className="flex gap-3">
                                {SOCIALS.map(({ icon: Icon, href, label }) => (
                                    <motion.a
                                        key={label}
                                        href={href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        whileHover={{ scale: 1.15, y: -2 }}
                                        whileTap={{ scale: 0.9 }}
                                        className="w-10 h-10 bg-white border border-border rounded-xl flex items-center justify-center text-text-secondary hover:text-navy hover:border-lime/50 hover:shadow-lime transition-all duration-200 shadow-card"
                                        aria-label={label}
                                    >
                                        <Icon size={16} />
                                    </motion.a>
                                ))}
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Floating stats card */}
                    <motion.div
                        initial={{ opacity: 0, x: 60 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1, duration: 0.8, ease: 'easeOut' }}
                        className="hidden lg:block absolute top-1/2 right-12 -translate-y-1/2"
                    >
                        <div className="bg-white rounded-3xl p-6 space-y-5 min-w-[200px] float shadow-card-hover border border-border">
                            {[
                                { label: 'Products Shipped', value: '10+' },
                                { label: 'Years Experience', value: '5+' },
                                { label: 'Users Impacted', value: '1M+' },
                            ].map(({ label, value }) => (
                                <div key={label} className="text-center">
                                    <div className="font-display font-black text-3xl text-navy">{value}</div>
                                    <div className="text-text-muted text-xs mt-0.5">{label}</div>
                                </div>
                            ))}
                            Lime accent bar
                            <div className="h-1.5 w-full bg-lime rounded-full" />
                        </div>
                    </motion.div>
                </div>
            </motion.div>

            {/* Scroll indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-text-muted"
            >
                <span className="text-xs uppercase tracking-widest">Scroll</span>
                <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                    <RiArrowDownLine size={18} />
                </motion.div>
            </motion.div>
        </section>
    );
}
