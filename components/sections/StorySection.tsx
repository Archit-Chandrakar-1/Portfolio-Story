'use client';
import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { RiLightbulbLine, RiUserHeartLine, RiRocketLine, RiBarChartLine } from 'react-icons/ri';

const STORY_BEATS = [
    {
        icon: RiLightbulbLine,
        label: 'Discovery',
        title: 'I start with Why',
        description:
            'Every great product begins with deep curiosity. I obsess over user problems, market signals, and unexplored opportunities before a single line of code is written.',
        color: 'lime',
    },
    {
        icon: RiUserHeartLine,
        label: 'Empathy',
        title: 'I listen to feel',
        description:
            'Hundreds of user interviews have taught me that the real problem is rarely the stated problem. I go deep to uncover the emotion beneath the friction.',
        color: 'mint',
    },
    {
        icon: RiBarChartLine,
        label: 'Strategy',
        title: 'I think in systems',
        description:
            'From north star metrics to quarterly roadmaps, I connect dots across business goals, user needs, and technical constraints to craft a strategy that sticks.',
        color: 'lime',
    },
    {
        icon: RiRocketLine,
        label: 'Execution',
        title: 'I ship and learn',
        description:
            'Done is better than perfect — but done right is best. I champion rapid experimentation, measure everything, and iterate relentlessly toward impact.',
        color: 'mint',
    },
];

export default function StorySection() {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
    const xLeft = useTransform(scrollYProgress, [0, 1], ['-8%', '0%']);
    const xRight = useTransform(scrollYProgress, [0, 1], ['8%', '0%']);

    return (
        <section ref={ref} className="py-24 relative overflow-hidden bg-bg">
            {/* Subtle background accent */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-lime/8 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6">
                {/* Header */}
                <ScrollReveal className="text-center mb-20">
                    <span className="bg-navy text-lime text-xs font-semibold px-4 py-1.5 rounded-full tracking-wider uppercase mb-4 inline-block">
                        My Story
                    </span>
                    <h2 className="font-display font-black text-4xl sm:text-5xl text-navy mt-4">
                        How I <span className="relative inline-block">
                            Build Products
                            <span className="absolute -bottom-1 left-0 right-0 h-2 bg-lime/50 -z-10 rounded" />
                        </span>
                    </h2>
                    <p className="text-text-secondary mt-4 max-w-xl mx-auto text-lg">
                        Product management is storytelling. Here's the narrative behind how I work.
                    </p>
                </ScrollReveal>

                {/* Story beats grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {STORY_BEATS.map((beat, i) => {
                        const Icon = beat.icon;
                        const isLeft = i % 2 === 0;
                        return (
                            <motion.div key={beat.label} style={{ x: isLeft ? xLeft : xRight }}>
                                <ScrollReveal delay={i * 0.1} direction={isLeft ? 'left' : 'right'}>
                                    <div className="bg-white rounded-3xl p-8 border border-border card-hover h-full shadow-card">
                                        {/* Step badge */}
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${beat.color === 'lime' ? 'bg-lime/25 border border-lime/40' : 'bg-mint/40 border border-mint/60'}`}>
                                                <Icon size={20} className={beat.color === 'lime' ? 'text-navy' : 'text-navy/70'} />
                                            </div>
                                            <span className="text-xs font-bold uppercase tracking-widest text-text-muted">
                                                {String(i + 1).padStart(2, '0')} · {beat.label}
                                            </span>
                                        </div>

                                        <h3 className="font-display font-bold text-2xl text-navy mb-3">
                                            {beat.title}
                                        </h3>
                                        <p className="text-text-secondary leading-relaxed">{beat.description}</p>
                                    </div>
                                </ScrollReveal>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Quote */}
                <ScrollReveal className="mt-16 text-center" delay={0.2}>
                    <blockquote className="bg-navy rounded-3xl p-10 max-w-3xl mx-auto">
                        <div className="text-5xl font-display text-lime/60 leading-none mb-4">&ldquo;</div>
                        <p className="font-display font-semibold text-xl sm:text-2xl text-white leading-relaxed">
                            The best products don't just solve problems — they{' '}
                            <span className="text-lime">change how people feel</span> about those problems.
                        </p>
                        <div className="mt-6 flex items-center justify-center gap-3">
                            <div className="h-px w-12 bg-white/20" />
                            <span className="text-white/50 text-sm">Archit Chandrakar</span>
                            <div className="h-px w-12 bg-white/20" />
                        </div>
                    </blockquote>
                </ScrollReveal>
            </div>
        </section>
    );
}
